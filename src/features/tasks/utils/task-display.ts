import { TASK_STATUS } from '../task.constants.ts';
import type { TaskListItem } from '../types/tasks.types.ts';

export { formatAppDate as formatTaskDate } from '@/shared/utils/date.ts';

export function formatRepeatEvery({value, unit}: TaskListItem['repeatEvery']) {
  const unitLabel = value === 1 ? unit.slice(0, -1) : unit;

  return `Every ${value} ${unitLabel}`;
}

export function isTaskScheduled(task: TaskListItem) {
  const startsAt = new Date(task.startsAt);

  if (Number.isNaN(startsAt.getTime())) {
    return task.status === TASK_STATUS.scheduled;
  }

  return startsAt.getTime() > Date.now();
}

export function isTaskCompletedToday(task: TaskListItem) {
  if (!task.lastCompletedAt) {
    return false;
  }

  const lastCompletedDate = new Date(task.lastCompletedAt);

  if (Number.isNaN(lastCompletedDate.getTime())) {
    return false;
  }

  const today = new Date();

  return lastCompletedDate.getFullYear() === today.getFullYear()
    && lastCompletedDate.getMonth() === today.getMonth()
    && lastCompletedDate.getDate() === today.getDate();
}
