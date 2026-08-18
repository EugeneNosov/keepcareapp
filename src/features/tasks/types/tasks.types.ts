import type { TASK_REPEAT_UNITS, TASK_STATUS } from '../task.constants.ts';

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type TaskRepeatUnit = typeof TASK_REPEAT_UNITS[number];

export interface TaskRepeatEvery {
  value: number;
  unit: TaskRepeatUnit;
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
