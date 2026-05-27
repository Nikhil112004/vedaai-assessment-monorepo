import type { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import { ApiError } from './api-error';
import { config } from '../config';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? null,
      },
    });
    return;
  }

  if (error instanceof MulterError) {
    res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: error.message,
        details: { field: error.field ?? null, code: error.code },
      },
    });
    return;
  }

  console.error('[api] Unhandled error', error);

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        config.nodeEnv === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown server error'
          : 'Something went wrong',
      details:
        config.nodeEnv === 'development'
          ? {
              name: error instanceof Error ? error.name : null,
            }
          : null,
    },
  });
};
