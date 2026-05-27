import { Queue } from 'bullmq';
import { redis } from '../infra/redis';

export const pdfQueueName = 'paper-pdf-generation';

export type PdfJobPayload = {
  assignmentId: string;
};

export const pdfQueue = new Queue<PdfJobPayload>(pdfQueueName, {
  connection: redis,
  defaultJobOptions: {
    attempts: 4,
    backoff: {
      type: 'exponential',
      delay: 1500,
    },
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});

