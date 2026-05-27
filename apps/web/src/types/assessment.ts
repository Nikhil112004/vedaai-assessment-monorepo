export type QuestionType = 'mcq' | 'short_answer' | 'long_answer' | 'case_study' | 'true_false';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type AssignmentStatus = 'draft' | 'queued' | 'processing' | 'completed' | 'failed';

export type PdfStatus = 'queued' | 'processing' | 'completed' | 'failed' | null;

export type CreateAssignmentInput = {
  dueDate: string;
  questionTypes: QuestionType[];
  questionTypeConfig?: Array<{
    questionType: QuestionType;
    questionCount: number;
    marks: number;
  }>;
  totalQuestions: number;
  totalMarks: number;
  instructions: string;
  sourceText?: string;
  createdBy?: string;
  sourceFile?: File | null;
};

export type AssignmentResponse = {
  _id: string;
  dueDate: string;
  questionTypes: QuestionType[];
  questionTypeConfig?: Array<{
    questionType: QuestionType;
    questionCount: number;
    marks: number;
  }>;
  totalQuestions: number;
  totalMarks: number;
  instructions: string;
  status: AssignmentStatus;
  sourceText?: string | null;
  createdAt?: string;
};

export type AssignmentListResponse = AssignmentResponse[];

export type AssignmentGenerationStatusResponse = {
  status: AssignmentStatus | null;
  jobId: string | null;
  generatedPaperId: string | null;
  error: string | null;
};

export type GeneratedQuestion = {
  text: string;
  difficulty: Difficulty;
  marks: number;
};

export type GeneratedSection = {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
};

export type GeneratedPaperMetadata = {
  subject: string;
  className: string;
  durationText: string;
};

export type GeneratedPaperResponse = {
  _id: string;
  assignmentId: string;
  metadata?: GeneratedPaperMetadata;
  sections: GeneratedSection[];
  pdf?: {
    status: PdfStatus;
    filePath: string | null;
    error: string | null;
    generatedAt: string | null;
  };
};

export type AssignmentStatusEvent = {
  assignmentId: string;
  status: string;
  jobId?: string;
  generatedPaperId?: string;
  error?: string;
};
