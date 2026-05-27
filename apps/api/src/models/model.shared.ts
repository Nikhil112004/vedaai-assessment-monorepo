import type { SchemaOptions } from 'mongoose';

export const baseSchemaOptions: SchemaOptions = {
  timestamps: true,
  strict: 'throw',
  optimisticConcurrency: true,
};

export const auditFields = {
  createdBy: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  updatedBy: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
  deletedAt: {
    type: Date,
    required: false,
    default: null,
  },
} as const;
