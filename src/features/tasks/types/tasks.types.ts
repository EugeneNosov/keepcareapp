import type { TASK_REPEAT_UNITS, TASK_STATUSES } from '../task.constants.ts';

export type TaskStatus = typeof TASK_STATUSES[number];
export type TaskRepeatUnit = typeof TASK_REPEAT_UNITS[number];

export interface TaskRepeatEvery {
  value: number;
  unit: TaskRepeatUnit;
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  repeatEvery: TaskRepeatEvery;
  createdAt: string;
  lastCompletedAt: string | null;
  dueDate: string;
}

export interface CreateTaskPayload {
  name: string;
  repeatEvery: TaskRepeatEvery;
}
