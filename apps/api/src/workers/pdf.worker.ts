import { createWriteStream } from 'node:fs';
import PDFDocument from 'pdfkit';
import { Worker } from 'bullmq';
import { GeneratedPaperModel } from '../models';
import { redis } from '../infra/redis';
import { emitAssignmentEvent } from '../infra/ws';
import { getPdfPath } from '../infra/storage';
import { pdfQueueName, type PdfJobPayload } from './pdf.queue';

const redisKey = (assignmentId: string): string => `assignment:${assignmentId}:job`;

const setJobState = async (
  assignmentId: string,
  state: Record<string, string | null>
): Promise<void> => {
  await redis.hset(redisKey(assignmentId), state as Record<string, string>);
  await redis.expire(redisKey(assignmentId), 60 * 60 * 24);
};

const renderPdf = async (assignmentId: string): Promise<string> => {
  const generatedPaper = await GeneratedPaperModel.findOne({ assignmentId }).lean<{
    metadata?: {
      subject?: string;
      className?: string;
      durationText?: string;
    };
    sections: Array<{
      title: string;
      instruction: string;
      questions: Array<{ text: string; difficulty: string; marks: number }>;
    }>;
  }>();

  if (!generatedPaper) {
    throw new Error('Generated paper not found for PDF generation');
  }

  const targetPath = await getPdfPath(assignmentId);

  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = createWriteStream(targetPath);
    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.on('error', reject);
    doc.pipe(stream);

    doc.fontSize(18).text('Question Paper', { align: 'center' });
    doc.fontSize(12).text(`Subject: ${generatedPaper.metadata?.subject ?? 'General'}`, { align: 'center' });
    doc.text(`Class: ${generatedPaper.metadata?.className ?? 'N/A'}`, { align: 'center' });
    doc.text(`Time Allowed: ${generatedPaper.metadata?.durationText ?? 'N/A'}`, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(12).text('Name: _______________________');
    doc.text('Roll Number: _________________');
    doc.text('Section: _____________________');
    doc.moveDown(1);

    generatedPaper.sections.forEach((section, sectionIndex) => {
      doc.fontSize(14).text(`${section.title || `Section ${sectionIndex + 1}`}`, { underline: true });
      doc.fontSize(11).text(section.instruction || 'Attempt all questions.');
      doc.moveDown(0.5);

      section.questions.forEach((question, index) => {
        doc
          .fontSize(11)
          .text(
            `${index + 1}. ${question.text} [${question.difficulty.toUpperCase()}] (${question.marks} marks)`,
            { align: 'left' }
          );
        doc.moveDown(0.35);
      });

      doc.moveDown(0.75);
    });

    doc.end();
  });

  return targetPath;
};

export const pdfWorker = new Worker<PdfJobPayload>(
  pdfQueueName,
  async (job) => {
    const { assignmentId } = job.data;
    await GeneratedPaperModel.findOneAndUpdate(
      { assignmentId },
      {
        $set: {
          'pdf.status': 'processing',
          'pdf.error': null,
        },
      },
      { new: true, upsert: false }
    ).lean();

    await setJobState(assignmentId, { pdfStatus: 'processing' });
    emitAssignmentEvent({ assignmentId, status: 'pdf_processing', jobId: job.id });

    const filePath = await renderPdf(assignmentId);

    await GeneratedPaperModel.findOneAndUpdate(
      { assignmentId },
      {
        $set: {
          'pdf.status': 'completed',
          'pdf.filePath': filePath,
          'pdf.error': null,
          'pdf.generatedAt': new Date(),
          updatedBy: 'system-worker',
        },
      },
      { new: true, upsert: false }
    ).lean();

    await setJobState(assignmentId, { pdfStatus: 'completed', pdfPath: filePath });
    emitAssignmentEvent({ assignmentId, status: 'pdf_completed', jobId: job.id });
  },
  { connection: redis, concurrency: 2 }
);

pdfWorker.on('failed', async (job, error) => {
  const assignmentId = job?.data?.assignmentId;
  if (!assignmentId) {
    return;
  }

  await GeneratedPaperModel.findOneAndUpdate(
    { assignmentId },
    {
      $set: {
        'pdf.status': 'failed',
        'pdf.error': error.message,
      },
    },
    { new: true, upsert: false }
  ).lean();
  await setJobState(assignmentId, { pdfStatus: 'failed', pdfError: error.message });
  emitAssignmentEvent({ assignmentId, status: 'pdf_failed', error: error.message, jobId: job?.id });
});
