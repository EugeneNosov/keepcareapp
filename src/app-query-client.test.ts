import { afterEach, describe, expect, test, vi } from 'vitest';
import { getActiveToast, toast } from '@/components/Toast/toast.ts';
import { ApiError } from '@/shared/api';
import {
  createAppQueryClient,
  handleGlobalMutationError,
  shouldRetryQuery,
} from './app-query-client.ts';

describe('application request error configuration', () => {
  afterEach(() => {
    toast.dismiss();
    vi.restoreAllMocks();
  });

  test('connects the global mutation handler to the query client', () => {
    const queryClient = createAppQueryClient();

    expect(queryClient.getMutationCache().config.onError)
      .toBe(handleGlobalMutationError);
  });

  test.each([
    new ApiError(500, 'Internal server details'),
    new TypeError('Failed to fetch'),
  ])('turns a global mutation failure into a safe toast', (error) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    handleGlobalMutationError(error);

    expect(getActiveToast()?.message).toBe(
      error instanceof TypeError
        ? 'Unable to connect to the server. Please try again.'
        : 'Something went wrong. Please try again.',
    );
  });

  test('uses the server message for a rate-limit toast', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    handleGlobalMutationError(
      new ApiError(429, 'Too many requests. Try again shortly.'),
    );

    expect(getActiveToast()?.message).toBe(
      'Too many requests. Try again shortly.',
    );
  });

  test.each([400, 409, 422])(
    'does not duplicate an inline status %i error with a global toast',
    (status) => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      handleGlobalMutationError(new ApiError(status, 'Correct the form.'));

      expect(getActiveToast()).toBeNull();
    },
  );

  test.each([401, 403])(
    'does not show an authentication status %i as a global toast',
    (status) => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      handleGlobalMutationError(new ApiError(status, 'Authentication failed.'));

      expect(getActiveToast()).toBeNull();
    },
  );

  test('does not retry expected client errors', () => {
    expect(shouldRetryQuery(0, new ApiError(422, 'Invalid request.'))).toBe(false);
    expect(shouldRetryQuery(0, new ApiError(401, 'Unauthorized.'))).toBe(false);
  });

  test('allows limited retries for transient failures and rate limits', () => {
    expect(shouldRetryQuery(0, new TypeError('Failed to fetch'))).toBe(true);
    expect(shouldRetryQuery(1, new ApiError(503, 'Unavailable.'))).toBe(true);
    expect(shouldRetryQuery(1, new ApiError(429, 'Rate limited.'))).toBe(true);
    expect(shouldRetryQuery(2, new TypeError('Failed to fetch'))).toBe(false);
  });
});
