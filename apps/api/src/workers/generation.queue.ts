import { Queue } from 'bullmq';
import { redis } from '../infra/redis';

export const generationQueueName = 'question-generation';

export type GenerationJobPayload = {
  assignmentId: string;
};

export const generationQueue = new Queue<GenerationJobPayload>(generationQueueName, {
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1500,
    },
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});
