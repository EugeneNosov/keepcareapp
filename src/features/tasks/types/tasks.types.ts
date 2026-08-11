import type { TASK_REPEAT_UNITS, TASK_STATUS } from '../task.constants.ts';

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
    };
  }
);

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

export type UpdateTaskPayload = CreateTaskPayload;

export interface TaskSummary {
  scheduledCount: number;
  overdueCount: number;
  dueSoonCount: number;
  okCount: number;
  allCount: number;
}
