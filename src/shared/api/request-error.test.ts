import { describe, expect, test } from 'vitest';
import { ApiError } from './api-error.ts';
import {
  getRequestErrorMessage,
  isInlineRequestError,
  shouldShowGlobalError,
} from './request-error.ts';

describe('request error policy', () => {
  test.each([400, 409, 422])(
    'treats an expected %i response as an inline error',
    (status) => {
      const error = new ApiError(status, 'Please correct the form.');

      expect(isInlineRequestError(error)).toBe(true);
      expect(shouldShowGlobalError(error)).toBe(false);
    },
  );

  test.each([401, 403, 429, 500])(
    'does not treat status %i as an inline form error',
    (status) => {
      expect(isInlineRequestError(new ApiError(status, 'Request failed.')))
        .toBe(false);
    },
  );

  test.each([401, 403])(
    'keeps authentication status %i out of global notifications',
    (status) => {
      expect(shouldShowGlobalError(new ApiError(status, 'Authentication failed.')))
        .toBe(false);
    },
  );

  test.each([429, 500, 503])(
    'shows a global notification for status %i',
    (status) => {
      expect(shouldShowGlobalError(new ApiError(status, 'Request failed.')))
        .toBe(true);
    },
  );

  test('shows unexpected non-HTTP errors globally', () => {
    expect(shouldShowGlobalError(new Error('Unexpected failure'))).toBe(true);
  });

  test('preserves the server message for rate limiting', () => {
    expect(getRequestErrorMessage(
      new ApiError(429, 'Too many requests. Try again in one minute.'),
    )).toBe('Too many requests. Try again in one minute.');
  });

  test('provides a useful message for network failures', () => {
    expect(getRequestErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Unable to connect to the server. Please try again.',
    );
  });

  test.each([
    new Error('Internal details'),
    new ApiError(500, 'Sensitive server details'),
    undefined,
  ])('uses a safe fallback for unexpected errors', (error) => {
    expect(getRequestErrorMessage(error)).toBe(
      'Something went wrong. Please try again.',
    );
  });
});
