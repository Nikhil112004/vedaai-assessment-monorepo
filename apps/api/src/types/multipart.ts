import multer from 'multer';
import { BadRequestError } from './api-error';

const maxUploadBytes = 10 * 1024 * 1024;
const allowedMimeTypes = new Set(['application/pdf', 'text/plain']);

export const assignmentUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxUploadBytes,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new BadRequestError('Unsupported file type. Use PDF or text file only.'));
      return;
    }
    cb(null, true);
  },
});

type BodyLike = Record<string, unknown>;

type ParsedQuestionTypeConfig = {
  questionType: string;
  questionCount: number;
  marks: number;
};

const parseQuestionTypeConfigEntry = (
  entry: unknown,
  index: number
): ParsedQuestionTypeConfig => {
  if (typeof entry !== 'object' || entry === null) {
    throw new BadRequestError('Invalid questionTypeConfig format', [
      {
        path: `questionTypeConfig[${index}]`,
        message: 'Each questionTypeConfig entry must be an object.',
      },
    ]);
  }

  const item = entry as Record<string, unknown>;
  const questionType = String(item.questionType ?? '').trim();
  const questionCount = Number(item.questionCount ?? NaN);
  const marks = Number(item.marks ?? NaN);

  if (!questionType) {
    throw new BadRequestError('Invalid questionTypeConfig format', [
      {
        path: `questionTypeConfig[${index}].questionType`,
        message: 'questionType is required.',
      },
    ]);
  }

  if (!Number.isInteger(questionCount) || questionCount < 1) {
    throw new BadRequestError('Invalid questionTypeConfig format', [
      {
        path: `questionTypeConfig[${index}].questionCount`,
        message: 'questionCount must be a positive integer.',
      },
    ]);
  }

  if (!Number.isInteger(marks) || marks < 1) {
    throw new BadRequestError('Invalid questionTypeConfig format', [
      {
        path: `questionTypeConfig[${index}].marks`,
        message: 'marks must be a positive integer.',
      },
    ]);
  }

  return {
    questionType,
    questionCount,
    marks,
  };
};

const parseQuestionTypes = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
};

const parseQuestionTypeConfig = (value: unknown): ParsedQuestionTypeConfig[] => {
  if (Array.isArray(value)) {
    return value.map((entry, index) => parseQuestionTypeConfigEntry(entry, index));
  }

  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      throw new BadRequestError('Invalid questionTypeConfig format', [
        {
          path: 'questionTypeConfig',
          message: 'questionTypeConfig must be a JSON array.',
        },
      ]);
    }
    return parsed.map((entry, index) => parseQuestionTypeConfigEntry(entry, index));
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new BadRequestError('Invalid questionTypeConfig format', [
      {
        path: 'questionTypeConfig',
        message: 'questionTypeConfig must be valid JSON.',
      },
    ]);
  }
};

export const normalizeAssignmentMultipartBody = (
  body: BodyLike
): {
  dueDate: string;
  questionTypes: string[];
  questionTypeConfig: ParsedQuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  instructions: string;
  sourceText?: string;
  createdBy?: string;
} => ({
  dueDate: String(body.dueDate ?? ''),
  questionTypes: parseQuestionTypes(body.questionTypes),
  questionTypeConfig: parseQuestionTypeConfig(body.questionTypeConfig),
  totalQuestions: Number(body.totalQuestions ?? NaN),
  totalMarks: Number(body.totalMarks ?? NaN),
  instructions: String(body.instructions ?? ''),
  sourceText: body.sourceText ? String(body.sourceText) : undefined,
  createdBy: body.createdBy ? String(body.createdBy) : undefined,
});
