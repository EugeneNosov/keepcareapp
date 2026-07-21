import { TASK_STATUS } from '../task.constants.ts';
import type { Task } from '../types/tasks.types.ts';

const taskDateFormatter = new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatRepeatEvery({value, unit}: Task['repeatEvery']) {
  const unitLabel = value === 1 ? unit.slice(0, -1) : unit;

  return `Every ${value} ${unitLabel}`;
}

export function formatTaskDate(date: string | null) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return taskDateFormatter.format(parsedDate);
}

export function isTaskScheduled(task: Task) {
  const startsAt = new Date(task.startsAt);

  if (Number.isNaN(startsAt.getTime())) {
    return task.status === TASK_STATUS.scheduled;
  }

  return startsAt.getTime() > Date.now();
}

export function isTaskCompletedToday(task: Task) {
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
