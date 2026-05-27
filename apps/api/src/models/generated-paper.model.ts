import { model, Schema, type InferSchemaType, type Types } from 'mongoose';
import { questionDifficulties } from './model.constants';
import { auditFields, baseSchemaOptions } from './model.shared';

const questionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: questionDifficulties,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const sectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instruction: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length > 0,
        message: 'Each section must include at least one question',
      },
    },
  },
  { _id: false }
);

const metadataSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
      default: 'General',
    },
    className: {
      type: String,
      required: true,
      trim: true,
      default: 'N/A',
    },
    durationText: {
      type: String,
      required: true,
      trim: true,
      default: 'N/A',
    },
  },
  { _id: false }
);

const generatedPaperSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    metadata: {
      type: metadataSchema,
      required: true,
      default: () => ({
        subject: 'General',
        className: 'N/A',
        durationText: 'N/A',
      }),
    },
    sections: {
      type: [sectionSchema],
      required: true,
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length > 0,
        message: 'At least one section is required',
      },
    },
    pdf: {
      status: {
        type: String,
        enum: ['queued', 'processing', 'completed', 'failed'],
        required: false,
        default: null,
      },
      filePath: {
        type: String,
        required: false,
        default: null,
      },
      error: {
        type: String,
        required: false,
        default: null,
      },
      generatedAt: {
        type: Date,
        required: false,
        default: null,
      },
    },
    ...auditFields,
  },
  baseSchemaOptions
);

generatedPaperSchema.index({ assignmentId: 1 }, { unique: true });

export type Question = InferSchemaType<typeof questionSchema>;
export type Section = InferSchemaType<typeof sectionSchema>;
export type GeneratedPaperDocument = InferSchemaType<typeof generatedPaperSchema> & {
  assignmentId: Types.ObjectId;
};

export const GeneratedPaperModel = model('GeneratedPaper', generatedPaperSchema);
