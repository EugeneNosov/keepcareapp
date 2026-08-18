import type {
  TaskHistoryEvent,
  TaskHistoryFilters,
  TaskHistoryPagination,
} from '@/shared/task-history/task-history.types.ts';

export type {
  TaskHistoryEventType,
  TaskHistoryFilters,
} from '@/shared/task-history/task-history.types.ts';

export interface TaskHistoryQuery extends TaskHistoryFilters {
  cursor?: string;
  limit?: number;
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
