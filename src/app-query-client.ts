import {
  MutationCache,
  QueryClient,
} from '@tanstack/react-query';
import { toast } from '@/components/Toast/toast.ts';
import {
  ApiError,
  getRequestErrorMessage,
  shouldShowGlobalError,
} from '@/shared/api';

export function handleGlobalMutationError(error: unknown) {
  console.error('Mutation error:', error);

  if (shouldShowGlobalError(error)) {
    toast.error(getRequestErrorMessage(error));
  }
}

export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (
    error instanceof ApiError
    && error.status >= 400
    && error.status < 500
    && error.status !== 429
  ) {
    return false;
  }

  return failureCount < 2;
}

export function createAppQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: handleGlobalMutationError,
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: true,
        retry: shouldRetryQuery,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export const queryClient = createAppQueryClient();
