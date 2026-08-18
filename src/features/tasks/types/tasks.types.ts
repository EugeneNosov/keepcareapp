import type { TASK_REPEAT_UNITS, TASK_STATUS } from '../task.constants.ts';
import type { IconType } from 'react-icons';

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type TaskRepeatUnit = typeof TASK_REPEAT_UNITS[number];

export interface TaskRepeatEvery {
  value: number;
  unit: TaskRepeatUnit;
}

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

export interface HistoryItem {
  color: string;
  date: string;
  description: string;
  icon: IconType;
  note?: string | null;
  title: string;
}

export interface Task {
  id: string;
  name: string;
  notes: string | null;
  status: TaskStatus;
  repeatEvery: TaskRepeatEvery;
  createdAt: string;
  startsAt: string;
  lastCompletedAt: string | null;
  dueDate: string;
}

export interface TaskListItem {
  id: string;
  name: string;
  status: TaskStatus;
  repeatEvery: TaskRepeatEvery;
  createdAt: string;
  startsAt: string;
  lastCompletedAt: string | null;
  dueDate: string;
}

export interface CreateTaskPayload {
  name: string;
  notes?: string;
  startsAt: string;
  repeatEvery: TaskRepeatEvery;
}

export interface DeleteTaskPayload {
  taskId: string;
  deleteHistory: boolean;
}

export interface CompleteTaskPayload {
  taskId: string;
  note?: string;
}

export type UpdateTaskPayload = CreateTaskPayload;

export interface TaskSummary {
  scheduledCount: number;
  overdueCount: number;
  dueSoonCount: number;
  okCount: number;
  allCount: number;
}
