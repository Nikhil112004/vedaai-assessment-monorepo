import { Router, type Router as ExpressRouter } from 'express';
import {
  createAssignment,
  deleteAssignmentById,
  getAssignmentById,
  listAssignments,
} from '../services/assignment.service';
import { enqueueGenerationJob, getGenerationJobStatus } from '../services/generation.service';
import { validateBody } from '../types/validate-request';
import { createAssignmentSchema, generatePaperSchema } from '../types/validation';
import { assignmentUpload, normalizeAssignmentMultipartBody } from '../types/multipart';
import { extractTextFromPdfBuffer } from '../infra/pdf-text-extractor';
import { saveSourceFile } from '../infra/storage';
import { BadRequestError } from '../types/api-error';

export const assignmentRouter: ExpressRouter = Router();

assignmentRouter.get('/', async (_req, res, next) => {
  try {
    const assignments = await listAssignments();
    res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
});

assignmentRouter.post('/', assignmentUpload.single('sourceFile'), async (req, res, next) => {
  try {
    const normalizedPayload = normalizeAssignmentMultipartBody(
      (req.body as Record<string, unknown> | undefined) ?? {}
    );
    const parsed = createAssignmentSchema.safeParse(normalizedPayload);
    if (!parsed.success) {
      throw new BadRequestError(
        'Invalid request body',
        parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }))
      );
    }

    let sourceFile:
      | {
          filename: string;
          mimeType: string;
          size: number;
          storedPath: string;
        }
      | null = null;
    const uploadedFile = req.file;
    if (uploadedFile) {
      const storedPath = await saveSourceFile({
        originalname: uploadedFile.originalname,
        buffer: uploadedFile.buffer,
      });
      sourceFile = {
        filename: uploadedFile.originalname,
        mimeType: uploadedFile.mimetype,
        size: uploadedFile.size,
        storedPath,
      };
    }

    let uploadedText: string | null = null;
    if (uploadedFile?.mimetype === 'text/plain') {
      uploadedText = uploadedFile.buffer.toString('utf8').slice(0, 12000);
    } else if (uploadedFile?.mimetype === 'application/pdf') {
      uploadedText = extractTextFromPdfBuffer(uploadedFile.buffer);
    }
    const sourceText = [parsed.data.sourceText, uploadedText]
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value))
      .join('\n\n');

    const assignment = await createAssignment({
      ...parsed.data,
      sourceFile: sourceFile ?? undefined,
      sourceText: sourceText || null,
    });
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
});

assignmentRouter.get('/:id', async (req, res, next) => {
  try {
    const assignmentId = String(req.params.id ?? '');
    const assignment = await getAssignmentById(assignmentId);
    res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
});

assignmentRouter.delete('/:id', async (req, res, next) => {
  try {
    const assignmentId = String(req.params.id ?? '');
    await deleteAssignmentById(assignmentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

assignmentRouter.post('/:id/generate', validateBody(generatePaperSchema), async (req, res, next) => {
  try {
    const assignmentId = String(req.params.id ?? '');
    const regenerate = (req.body as { regenerate?: boolean }).regenerate ?? false;
    const result = await enqueueGenerationJob(assignmentId, regenerate);
    res.status(202).json(result);
  } catch (error) {
    next(error);
  }
});

assignmentRouter.get('/:id/status', async (req, res, next) => {
  try {
    const assignmentId = String(req.params.id ?? '');
    const status = await getGenerationJobStatus(assignmentId);
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
});
