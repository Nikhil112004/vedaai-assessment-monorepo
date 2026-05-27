import { GeneratedPaperModel, type GeneratedPaperDocument } from '../models';
import { mapMongoError } from './mongo-error.util';
import { NotFoundError } from '../types/api-error';
import { promises as fs } from 'node:fs';

export type GeneratedPaperResponse = GeneratedPaperDocument;

export const getGeneratedPaperByAssignmentId = async (
  assignmentId: string
): Promise<GeneratedPaperResponse> => {
  try {
    const paper = await GeneratedPaperModel.findOne({ assignmentId }).lean<GeneratedPaperResponse | null>();
    if (!paper) {
      throw new NotFoundError('Generated paper not found', { assignmentId });
    }
    return paper;
  } catch (error) {
    mapMongoError(error);
    throw error;
  }
};

export const getGeneratedPaperPdfByAssignmentId = async (
  assignmentId: string
): Promise<{ filePath: string; buffer: Buffer }> => {
  try {
    type GeneratedPaperPdfSnapshot = {
      pdf?: {
        status?: 'queued' | 'processing' | 'completed' | 'failed' | null;
        filePath?: string | null;
      } | null;
    };

    const paper = await GeneratedPaperModel.findOne({ assignmentId })
      .select({ pdf: 1 })
      .lean<GeneratedPaperPdfSnapshot | null>();
    const filePath = paper?.pdf?.filePath ?? null;
    if (!paper || paper.pdf?.status !== 'completed' || !filePath) {
      throw new NotFoundError('Generated paper pdf not found', { assignmentId });
    }

    const buffer = await fs.readFile(filePath);
    return { filePath, buffer };
  } catch (error) {
    mapMongoError(error);
    throw error;
  }
};
