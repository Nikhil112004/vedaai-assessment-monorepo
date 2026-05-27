import { model, Schema, type InferSchemaType } from 'mongoose';
import { assignmentQuestionTypes, assignmentStatuses } from './model.constants';
import { auditFields, baseSchemaOptions } from './model.shared';

const assignmentSchema = new Schema(
  {
    dueDate: {
      type: Date,
      required: true,
    },
    questionTypes: {
      type: [String],
      required: true,
      default: [],
      enum: assignmentQuestionTypes,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: 'At least one question type is required',
      },
    },
    questionTypeConfig: {
      type: [
        {
          questionType: {
            type: String,
            enum: assignmentQuestionTypes,
            required: true,
          },
          questionCount: {
            type: Number,
            required: true,
            min: 1,
          },
          marks: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      required: false,
      default: [],
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    instructions: {
      type: String,
      required: true,
      trim: true,
    },
    sourceFile: {
      filename: { type: String, required: false, default: null },
      mimeType: { type: String, required: false, default: null },
      size: { type: Number, required: false, default: null },
      storedPath: { type: String, required: false, default: null },
    },
    sourceText: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: assignmentStatuses,
      default: 'draft',
      required: true,
    },
    ...auditFields,
  },
  baseSchemaOptions
);

assignmentSchema.index({ status: 1, dueDate: 1 });

export type AssignmentDocument = InferSchemaType<typeof assignmentSchema>;

export const AssignmentModel = model('Assignment', assignmentSchema);
