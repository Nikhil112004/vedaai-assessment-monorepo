import { appConfig } from '../config';
import type {
  AssignmentGenerationStatusResponse,
  AssignmentListResponse,
  AssignmentResponse,
  CreateAssignmentInput,
  GeneratedPaperResponse,
} from '../../types/assessment';

type ApiErrorResponse = {
  error?: {
    message?: string;
  };
};

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as ApiErrorResponse;
    return data.error?.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

const toFormData = (input: CreateAssignmentInput): FormData => {
  const formData = new FormData();
  formData.append('dueDate', input.dueDate);
  formData.append('questionTypes', input.questionTypes.join(','));
  if (input.questionTypeConfig?.length) {
    formData.append('questionTypeConfig', JSON.stringify(input.questionTypeConfig));
  }
  formData.append('totalQuestions', String(input.totalQuestions));
  formData.append('totalMarks', String(input.totalMarks));
  formData.append('instructions', input.instructions);

  if (input.sourceText) {
    formData.append('sourceText', input.sourceText);
  }
  if (input.createdBy) {
    formData.append('createdBy', input.createdBy);
  }
  if (input.sourceFile) {
    formData.append('sourceFile', input.sourceFile);
  }
  return formData;
};

export const assignmentApi = {
  async listAssignments(): Promise<AssignmentListResponse> {
    const response = await fetch(`${appConfig.apiBaseUrl}/assignments`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return (await response.json()) as AssignmentListResponse;
  },

  async createAssignment(input: CreateAssignmentInput): Promise<AssignmentResponse> {
    const response = await fetch(`${appConfig.apiBaseUrl}/assignments`, {
      method: 'POST',
      body: toFormData(input),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return (await response.json()) as AssignmentResponse;
  },

  async getAssignmentById(assignmentId: string): Promise<AssignmentResponse> {
    const response = await fetch(`${appConfig.apiBaseUrl}/assignments/${assignmentId}`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return (await response.json()) as AssignmentResponse;
  },

  async deleteAssignment(assignmentId: string): Promise<void> {
    const response = await fetch(`${appConfig.apiBaseUrl}/assignments/${assignmentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
  },

  async generatePaper(assignmentId: string, regenerate = false): Promise<{ status: string; jobId: string }> {
    const response = await fetch(`${appConfig.apiBaseUrl}/assignments/${assignmentId}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regenerate }),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return (await response.json()) as { status: string; jobId: string };
  },

  async getGenerationStatus(assignmentId: string): Promise<AssignmentGenerationStatusResponse> {
    const response = await fetch(`${appConfig.apiBaseUrl}/assignments/${assignmentId}/status`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return (await response.json()) as AssignmentGenerationStatusResponse;
  },

  async getGeneratedPaper(assignmentId: string): Promise<GeneratedPaperResponse> {
    const response = await fetch(`${appConfig.apiBaseUrl}/generated-papers/assignment/${assignmentId}`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return (await response.json()) as GeneratedPaperResponse;
  },

  getGeneratedPaperPdfUrl(assignmentId: string): string {
    return `${appConfig.apiBaseUrl}/generated-papers/assignment/${assignmentId}/pdf`;
  },
};
