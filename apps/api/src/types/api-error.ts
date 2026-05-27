export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(404, 'NOT_FOUND', message, details);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(409, 'CONFLICT', message, details);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, 'BAD_REQUEST', message, details);
  }
}
