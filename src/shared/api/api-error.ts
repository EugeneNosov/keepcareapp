type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }

  static fromResponse(status: number, payload: unknown): ApiError {
    if (!isApiErrorPayload(payload)) {
      return new ApiError(status, 'Something went wrong. Please try again.');
    }

    const details = Array.isArray(payload.message)
      ? payload.message
      : payload.message
        ? [payload.message]
        : [];
    const message =
      details[0] ?? payload.error ?? 'Something went wrong. Please try again.';

    return new ApiError(status, message, details);
  }
}

function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload {
  if (
    typeof payload !== 'object'
    || payload === null
    || Array.isArray(payload)
  ) {
    return false;
  }

  const {message, error} = payload as Record<string, unknown>;
  const hasValidMessage = message === undefined
    || typeof message === 'string'
    || (
      Array.isArray(message)
      && message.every((detail) => typeof detail === 'string')
    );
  const hasValidError = error === undefined || typeof error === 'string';

  return hasValidMessage && hasValidError;
}
