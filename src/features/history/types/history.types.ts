import type { TaskHistoryEvent } from '@/features/tasks/types/tasks.types.ts';

export interface TaskHistoryQuery {
  cursor?: string;
  limit?: number;
}

export interface TaskHistoryPagination {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export type TaskHistoryFeedEvent = TaskHistoryEvent & {
  task: {
    id: string;
    name: string;
    isDeleted: boolean;
  };
};

export interface TaskHistoryFeedResponse {
  data: TaskHistoryFeedEvent[];
  meta: {
    pagination: TaskHistoryPagination;
  };
}
