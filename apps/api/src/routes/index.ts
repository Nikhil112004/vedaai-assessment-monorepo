import { Router, type Router as ExpressRouter } from 'express';
import { assignmentRouter } from './assignment.routes';
import { generatedPaperRouter } from './generated-paper.routes';

export const apiRouter: ExpressRouter = Router();

apiRouter.use('/assignments', assignmentRouter);
apiRouter.use('/generated-papers', generatedPaperRouter);
