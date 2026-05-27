import { Router, type Router as ExpressRouter } from 'express';
import {
  getGeneratedPaperByAssignmentId,
  getGeneratedPaperPdfByAssignmentId,
} from '../services/generated-paper.service';

export const generatedPaperRouter: ExpressRouter = Router();

generatedPaperRouter.get('/assignment/:assignmentId', async (req, res, next) => {
  try {
    const assignmentId = String(req.params.assignmentId ?? '');
    const generatedPaper = await getGeneratedPaperByAssignmentId(assignmentId);
    res.status(200).json(generatedPaper);
  } catch (error) {
    next(error);
  }
});

generatedPaperRouter.get('/assignment/:assignmentId/pdf', async (req, res, next) => {
  try {
    const assignmentId = String(req.params.assignmentId ?? '');
    const result = await getGeneratedPaperPdfByAssignmentId(assignmentId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${assignmentId}.pdf"`);
    res.status(200).send(result.buffer);
  } catch (error) {
    next(error);
  }
});
