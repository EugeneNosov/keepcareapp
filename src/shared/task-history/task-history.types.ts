export type TaskHistoryUpdatedField = 'name' | 'notes' | 'startsAt' | 'repeatEvery';

interface TaskHistoryEventBase {
  id: string;
  occurredAt: string;
}

export type TaskHistoryEvent = TaskHistoryEventBase & (
  | {
    type: 'task_created';
    details: Record<string, never>;
  }
  | {
    type: 'task_updated';
    details: {
      updatedFields: TaskHistoryUpdatedField[];
    };
  }
  | {
    type: 'task_completed';
    details: {
      nextDueAt: string | null;
      note?: string | null;
    };
  }
  | {
    type: 'task_deleted';
    details: Record<string, never>;
  }
);

export type TaskHistoryEventType = TaskHistoryEvent['type'];

export interface TaskHistoryFilters {
  eventTypes: TaskHistoryEventType[];
  includeDeletedTasks: boolean;
}

export interface TaskHistoryQuery {
  cursor?: string;
  limit?: number;
}

export interface TaskHistoryPagination {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface TaskHistoryResponse {
  data: TaskHistoryEvent[];
  meta: {
    pagination: TaskHistoryPagination;
  };
}
