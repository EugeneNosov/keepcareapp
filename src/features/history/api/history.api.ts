import { apiRequest } from '@/shared/api';
import type {
  TaskHistoryFeedResponse,
  TaskHistoryQuery,
} from '../types/history.types.ts';

export function getTaskHistoryFeed(
  query: TaskHistoryQuery = {},
  signal?: AbortSignal,
) {
  const searchParams = new URLSearchParams();

  if (query.limit !== undefined) {
    searchParams.set('limit', String(query.limit));
  }

  if (query.cursor) {
    searchParams.set('cursor', query.cursor);
  }

  const queryString = searchParams.toString();
  const path = `/tasks/history${queryString ? `?${queryString}` : ''}`;

  return apiRequest<TaskHistoryFeedResponse>(path, {signal});
}
