import mongoose from 'mongoose';
import { BadRequestError, ConflictError } from '../types/api-error';

type DuplicateKeyError = {
  code?: number;
  keyValue?: Record<string, unknown>;
};

export const mapMongoError = (error: unknown): never => {
  const duplicateKeyError = error as DuplicateKeyError;
  if (duplicateKeyError?.code === 11000) {
    throw new ConflictError('Resource already exists', {
      duplicateFields: duplicateKeyError.keyValue ?? {},
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map((entry) => ({
      field: entry.path,
      message: entry.message,
    }));
    throw new BadRequestError('Validation failed', details);
  }

  if (error instanceof mongoose.Error.CastError) {
    throw new BadRequestError('Invalid resource identifier', {
      path: error.path,
      value: error.value,
    });
  }

  throw error;
};
