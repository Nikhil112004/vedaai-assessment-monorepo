import { AssignmentModel } from '../models';
import { redis } from '../infra/redis';
import { ConflictError, NotFoundError } from '../types/api-error';
import { mapMongoError } from './mongo-error.util';
import { generationQueue } from '../workers/generation.queue';

const redisKey = (assignmentId: string): string => `assignment:${assignmentId}:job`;
const generationJobId = (assignmentId: string, regenerate: boolean): string => {
  const baseId = `assignment-${assignmentId}-generation`;
  return regenerate ? `${baseId}-${Date.now()}` : baseId;
};

export const enqueueGenerationJob = async (
  assignmentId: string,
  regenerate = false
): Promise<{ assignmentId: string; jobId: string; status: string }> => {
  try {
    const assignment = await AssignmentModel.findById(assignmentId)
      .select({ status: 1 })
      .lean<{ status: string }>();
    if (!assignment) {
      throw new NotFoundError('Assignment not found', { assignmentId });
    }

    if (!regenerate && (assignment.status === 'queued' || assignment.status === 'processing')) {
      throw new ConflictError('Generation already in progress', {
        assignmentId,
        status: assignment.status,
      });
    }

    await AssignmentModel.findByIdAndUpdate(assignmentId, { status: 'queued' }).lean();
    const job = await generationQueue.add(
      'generate-paper',
      { assignmentId },
      {
        jobId: generationJobId(assignmentId, regenerate),
      }
    );

    await redis.hset(redisKey(assignmentId), {
      status: 'queued',
      jobId: job.id?.toString() ?? '',
    });
    await redis.expire(redisKey(assignmentId), 60 * 60 * 24);

    return {
      assignmentId,
      jobId: job.id?.toString() ?? '',
      status: 'queued',
    };
  } catch (error) {
    mapMongoError(error);
    throw error;
  }
};

export const getGenerationJobStatus = async (
  assignmentId: string
): Promise<Record<string, string | null>> => {
  try {
    const status = await redis.hgetall(redisKey(assignmentId));
    if (Object.keys(status).length === 0) {
      const assignment = await AssignmentModel.findById(assignmentId)
        .select({ status: 1 })
        .lean<{ status: string }>();
      if (!assignment) {
        throw new NotFoundError('Assignment not found', { assignmentId });
      }
      return {
        status: assignment.status,
        jobId: null,
        generatedPaperId: null,
        error: null,
      };
    }

    return {
      status: status.status ?? null,
      jobId: status.jobId ?? null,
      generatedPaperId: status.generatedPaperId ?? null,
      error: status.error ?? null,
    };
  } catch (error) {
    mapMongoError(error);
    throw error;
  }
};
