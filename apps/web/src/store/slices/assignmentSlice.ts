import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { assignmentApi } from '@/lib/api/assignment-api';
import type {
  AssignmentGenerationStatusResponse,
  AssignmentStatus,
  AssignmentStatusEvent,
  AssignmentResponse,
  CreateAssignmentInput,
  GeneratedPaperResponse,
  PdfStatus,
  QuestionType,
} from '@/types/assessment';

type AsyncState = 'idle' | 'loading' | 'succeeded' | 'failed';

export type AssignmentFormState = {
  dueDate: string;
  questionTypes: QuestionType[];
  totalQuestions: number;
  totalMarks: number;
  instructions: string;
  sourceText: string;
  createdBy: string;
  sourceFile: File | null;
};

type AssignmentState = {
  form: AssignmentFormState;
  currentAssignmentId: string | null;
  assignment: AssignmentResponse | null;
  assignmentRequestState: AsyncState;
  generationRequestState: AsyncState;
  paperRequestState: AsyncState;
  assignmentStatus: AssignmentStatus | null;
  generationJobId: string | null;
  generatedPaper: GeneratedPaperResponse | null;
  pdfStatus: PdfStatus;
  errorMessage: string | null;
};

const initialState: AssignmentState = {
  form: {
    dueDate: '',
    questionTypes: ['mcq'],
    totalQuestions: 10,
    totalMarks: 50,
    instructions: '',
    sourceText: '',
    createdBy: '',
    sourceFile: null,
  },
  currentAssignmentId: null,
  assignment: null,
  assignmentRequestState: 'idle',
  generationRequestState: 'idle',
  paperRequestState: 'idle',
  assignmentStatus: null,
  generationJobId: null,
  generatedPaper: null,
  pdfStatus: null,
  errorMessage: null,
};

export const createAssignmentThunk = createAsyncThunk(
  'assignment/createAssignment',
  async (input: CreateAssignmentInput) => assignmentApi.createAssignment(input)
);

export const generatePaperThunk = createAsyncThunk(
  'assignment/generatePaper',
  async ({ assignmentId, regenerate }: { assignmentId: string; regenerate: boolean }) =>
    assignmentApi.generatePaper(assignmentId, regenerate)
);

export const fetchGenerationStatusThunk = createAsyncThunk(
  'assignment/fetchGenerationStatus',
  async (assignmentId: string): Promise<AssignmentGenerationStatusResponse> =>
    assignmentApi.getGenerationStatus(assignmentId)
);

export const fetchGeneratedPaperThunk = createAsyncThunk(
  'assignment/fetchGeneratedPaper',
  async (assignmentId: string): Promise<GeneratedPaperResponse> => assignmentApi.getGeneratedPaper(assignmentId)
);

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    setCurrentAssignmentId: (state, action: PayloadAction<string>) => {
      state.currentAssignmentId = action.payload;
    },
    setFormValue: <K extends keyof AssignmentFormState>(
      state: AssignmentState,
      action: PayloadAction<{ key: K; value: AssignmentFormState[K] }>
    ) => {
      state.form[action.payload.key] = action.payload.value;
    },
    applyAssignmentStatusEvent: (state, action: PayloadAction<AssignmentStatusEvent>) => {
      const event = action.payload;
      if (state.currentAssignmentId && event.assignmentId !== state.currentAssignmentId) return;

      if (event.status === 'queued' || event.status === 'processing' || event.status === 'completed' || event.status === 'failed') {
        state.assignmentStatus = event.status;
      }
      if (event.status.startsWith('pdf_')) {
        const normalized = event.status.replace('pdf_', '');
        if (normalized === 'queued' || normalized === 'processing' || normalized === 'completed' || normalized === 'failed') {
          state.pdfStatus = normalized;
        }
      }
      if (event.error) state.errorMessage = event.error;
      if (event.jobId) state.generationJobId = event.jobId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAssignmentThunk.pending, (state) => {
        state.assignmentRequestState = 'loading';
        state.errorMessage = null;
      })
      .addCase(createAssignmentThunk.fulfilled, (state, action) => {
        state.assignmentRequestState = 'succeeded';
        state.assignment = action.payload;
        state.currentAssignmentId = action.payload._id;
        state.assignmentStatus = action.payload.status;
      })
      .addCase(createAssignmentThunk.rejected, (state, action) => {
        state.assignmentRequestState = 'failed';
        state.errorMessage = action.error.message ?? 'Failed to create assignment';
      })
      .addCase(generatePaperThunk.pending, (state) => {
        state.generationRequestState = 'loading';
        state.errorMessage = null;
      })
      .addCase(generatePaperThunk.fulfilled, (state, action) => {
        state.generationRequestState = 'succeeded';
        state.assignmentStatus = action.payload.status as AssignmentStatus;
        state.generationJobId = action.payload.jobId;
      })
      .addCase(generatePaperThunk.rejected, (state, action) => {
        state.generationRequestState = 'failed';
        state.errorMessage = action.error.message ?? 'Failed to start generation';
      })
      .addCase(fetchGenerationStatusThunk.fulfilled, (state, action) => {
        state.assignmentStatus = action.payload.status;
        state.generationJobId = action.payload.jobId;
        if (action.payload.error) state.errorMessage = action.payload.error;
      })
      .addCase(fetchGeneratedPaperThunk.pending, (state) => {
        state.paperRequestState = 'loading';
      })
      .addCase(fetchGeneratedPaperThunk.fulfilled, (state, action) => {
        state.paperRequestState = 'succeeded';
        state.generatedPaper = action.payload;
        state.pdfStatus = action.payload.pdf?.status ?? null;
      })
      .addCase(fetchGeneratedPaperThunk.rejected, (state, action) => {
        state.paperRequestState = 'failed';
        state.errorMessage = action.error.message ?? 'Failed to fetch generated paper';
      });
  },
});

export const { setCurrentAssignmentId, setFormValue, applyAssignmentStatusEvent } = assignmentSlice.actions;
export default assignmentSlice.reducer;
