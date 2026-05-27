import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { BadRequestError } from './api-error';

export const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(
        new BadRequestError(
          'Invalid request body',
          parsed.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          }))
        )
      );
      return;
    }
    req.body = parsed.data;
    next();
  };
