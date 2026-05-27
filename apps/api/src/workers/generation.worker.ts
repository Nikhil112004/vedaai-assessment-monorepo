import { Worker } from 'bullmq';
import { AssignmentModel, GeneratedPaperModel } from '../models';
import { redis } from '../infra/redis';
import { emitAssignmentEvent } from '../infra/ws';
import { generateStructuredPaper } from './question-generation.ai';
import { generationQueueName, type GenerationJobPayload } from './generation.queue';
import { pdfQueue } from './pdf.queue';

const redisKey = (assignmentId: string): string => `assignment:${assignmentId}:job`;
const pdfJobId = (assignmentId: string, generationJobIdValue?: string): string => {
  const suffix = generationJobIdValue ? `-${generationJobIdValue}` : `-${Date.now()}`;
  return `assignment-${assignmentId}-pdf${suffix}`;
};

const setJobState = async (
  assignmentId: string,
  state: Record<string, string | null>
): Promise<void> => {
  await redis.hset(redisKey(assignmentId), state as Record<string, string>);
  await redis.expire(redisKey(assignmentId), 60 * 60 * 24);
};

export const generationWorker = new Worker<GenerationJobPayload>(
  generationQueueName,
  async (job) => {
    const { assignmentId } = job.data;

    await AssignmentModel.findByIdAndUpdate(assignmentId, { status: 'processing' }).lean();
    await setJobState(assignmentId, { status: 'processing', jobId: job.id ?? null, error: null });
    emitAssignmentEvent({ assignmentId, status: 'processing', jobId: job.id });

    const assignment = await AssignmentModel.findById(assignmentId).lean<{
      dueDate: Date | string;
      questionTypes: string[];
      questionTypeConfig?: Array<{
        questionType: string;
        questionCount: number;
        marks: number;
      }>;
      totalQuestions: number;
      totalMarks: number;
      instructions: string;
      sourceText?: string | null;
      sourceFile?: {
        filename?: string | null;
        mimeType?: string | null;
      } | null;
    }>();
    if (!assignment) {
      throw new Error('Assignment not found while processing job');
    }

    const structuredPaper = await generateStructuredPaper(assignment);

    const generatedPaper = await GeneratedPaperModel.findOneAndUpdate(
      { assignmentId },
      {
        assignmentId,
        metadata: structuredPaper.metadata,
        sections: structuredPaper.sections,
        pdf: {
          status: 'queued',
          filePath: null,
          error: null,
          generatedAt: null,
        },
        updatedBy: 'system-worker',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    await AssignmentModel.findByIdAndUpdate(assignmentId, { status: 'completed' }).lean();
    await setJobState(assignmentId, {
      status: 'completed',
      jobId: job.id ?? null,
      generatedPaperId: generatedPaper?._id?.toString() ?? null,
      error: null,
    });
    emitAssignmentEvent({
      assignmentId,
      status: 'completed',
      jobId: job.id,
      generatedPaperId: generatedPaper?._id?.toString(),
    });

    await pdfQueue.add(
      'generate-paper-pdf',
      { assignmentId },
      { jobId: pdfJobId(assignmentId, job.id?.toString()) }
    );
    await setJobState(assignmentId, { pdfStatus: 'queued' });
    emitAssignmentEvent({ assignmentId, status: 'pdf_queued' });
  },
  { connection: redis, concurrency: 2 }
);

generationWorker.on('failed', async (job, error) => {
  const assignmentId = job?.data?.assignmentId;
  if (!assignmentId) {
    return;
  }

  await AssignmentModel.findByIdAndUpdate(assignmentId, { status: 'failed' }).lean();
  await setJobState(assignmentId, {
    status: 'failed',
    jobId: job?.id ?? null,
    error: error.message,
  });
  emitAssignmentEvent({
    assignmentId,
    status: 'failed',
    jobId: job?.id,
    error: error.message,
  });
});
