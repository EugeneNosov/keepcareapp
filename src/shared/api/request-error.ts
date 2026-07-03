import { ApiError } from './api-error.ts';

export function shouldShowGlobalError(error: unknown) {
  if (!(error instanceof ApiError)) {
    return true;
  }

  return error.status === 429 || error.status >= 500;
}

export function isInlineRequestError(error: unknown): error is ApiError {
  return error instanceof ApiError
    && error.status >= 400
    && error.status < 500
    && error.status !== 401
    && error.status !== 403
    && error.status !== 429;
}

export function getRequestErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 429) {
    return error.message;
  }

  if (error instanceof TypeError) {
    return 'Unable to connect to the server. Please try again.';
  }

  return 'Something went wrong. Please try again.';
}
