import type { TASK_STATUSES } from '../task.constants.ts';

export type TaskStatus = typeof TASK_STATUSES[number];

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  scheduledFor: string;
}
