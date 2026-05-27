import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'node:http';
import { config } from './config';
import { apiRouter } from './routes';
import { errorHandler } from './types/error-handler';
import { initializeSocketServer, shutdownSocketServer } from './infra/ws';
import { shutdownRedis } from './infra/redis';
import { generationWorker } from './workers/generation.worker';
import { generationQueue } from './workers/generation.queue';
import { pdfQueue } from './workers/pdf.queue';
import { pdfWorker } from './workers/pdf.worker';
import { ensureStorageDirs } from './infra/storage';

const app = express();
let server: http.Server | null = null;
let shuttingDown = false;

app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
app.use('/api', apiRouter);

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await ensureStorageDirs();
  await mongoose.connect(config.mongoUri);
  console.info('[api] MongoDB connected');
  server = http.createServer(app);
  initializeSocketServer(server);

  server.listen(config.port, () => {
    console.info(`[api] Server running on port ${config.port}`);
  });
};

const shutdown = async (): Promise<void> => {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  await Promise.allSettled([
    new Promise<void>((resolve) => {
      if (!server) {
        resolve();
        return;
      }
      server.close(() => resolve());
    }),
    generationWorker.close(),
    generationQueue.close(),
    pdfWorker.close(),
    pdfQueue.close(),
    shutdownSocketServer(),
    shutdownRedis(),
    mongoose.disconnect(),
  ]);

  process.exit(0);
};

process.on('SIGINT', () => {
  void shutdown();
});

process.on('SIGTERM', () => {
  void shutdown();
});

startServer().catch((error) => {
  console.error('[api] Failed to start server', error);
  process.exit(1);
});

