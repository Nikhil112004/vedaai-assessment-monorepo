import { AssignmentModel, GeneratedPaperModel, type AssignmentDocument } from '../models';
import { mapMongoError } from './mongo-error.util';
import { NotFoundError } from '../types/api-error';
import { removeStorageFileIfExists } from '../infra/storage';

export type CreateAssignmentInput = {
  dueDate: string;
  questionTypes: string[];
  questionTypeConfig?: Array<{
    questionType: string;
    questionCount: number;
    marks: number;
  }>;
  totalQuestions: number;
  totalMarks: number;
  instructions: string;
  sourceText?: string | null;
  sourceFile?: {
    filename: string;
    mimeType: string;
    size: number;
    storedPath: string;
  } | null;
  createdBy?: string;
};

export const createAssignment = async (
  input: CreateAssignmentInput
): Promise<AssignmentDocument> => {
  try {
    const assignment = await AssignmentModel.create({
      ...input,
      dueDate: new Date(input.dueDate),
    });
    return assignment.toObject();
  } catch (error) {
    mapMongoError(error);
    throw error;
  }
};

export const getAssignmentById = async (id: string): Promise<AssignmentDocument> => {
  try {
    const assignment = await AssignmentModel.findById(id).lean();
    if (!assignment) {
      throw new NotFoundError('Assignment not found', { assignmentId: id });
    }
    return assignment;
  } catch (error) {
    mapMongoError(error);
    throw error;
  }
};

export const listAssignments = async (): Promise<AssignmentDocument[]> => {
  try {
    const assignments = await AssignmentModel.find({})
      .sort({ createdAt: -1 })
      .lean();
    return assignments;
  } catch (error) {
    mapMongoError(error);
    throw error;
  }
};

export const deleteAssignmentById = async (id: string): Promise<void> => {
  try {
    const assignment = await AssignmentModel.findByIdAndDelete(id)
      .select({ sourceFile: 1 })
      .lean<{
        sourceFile?: {
          storedPath?: string | null;
        } | null;
      }>();
    if (!assignment) {
      throw new NotFoundError('Assignment not found', { assignmentId: id });
    }

    const generatedPaper = await GeneratedPaperModel.findOneAndDelete({ assignmentId: id })
      .select({ pdf: 1 })
      .lean<{
        pdf?: {
          filePath?: string | null;
        } | null;
      }>();

    const sourceFilePath = assignment.sourceFile?.storedPath ?? null;
    const generatedPdfPath = generatedPaper?.pdf?.filePath ?? null;
    const cleanupResults = await Promise.allSettled([
      removeStorageFileIfExists(sourceFilePath),
      removeStorageFileIfExists(generatedPdfPath),
    ]);

    cleanupResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        const targetLabel = index === 0 ? 'source upload' : 'generated pdf';
        console.warn(`[assignment] Failed to cleanup ${targetLabel} for assignment ${id}`, result.reason);
      }
    });
  } catch (error) {
    mapMongoError(error);
    throw error;
  }
};
