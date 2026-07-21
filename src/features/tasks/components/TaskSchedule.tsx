import Card from '@/components/Card/Card.tsx';
import { TASK_STATUS_STYLES } from '../task.constants.ts';
import type { Task } from '../types/tasks.types.ts';
import {
  formatRepeatEvery,
  formatTaskDate,
  isTaskScheduled,
} from '../utils/task-display.ts';

interface TaskScheduleProps {
  task: Task;
}

export default function TaskSchedule({task}: TaskScheduleProps) {
  const statusColor = TASK_STATUS_STYLES[task.status].color;
  const isScheduled = isTaskScheduled(task);

  return (
    <Card className="p-6 shadow-none">
      <h2 className="text-sm font-medium text-text-soft">Schedule</h2>
      <dl className="mt-5 divide-y divide-border-app">
        <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
          <dt className="text-[11px] text-text-subtle">Repeats</dt>
          <dd className="text-right text-xs text-text-soft">{formatRepeatEvery(task.repeatEvery)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
          <dt className="text-[11px] text-text-subtle">Starts</dt>
          <dd className="text-right text-xs text-text-soft">{formatTaskDate(task.startsAt) ?? '—'}</dd>
        </div>
        {isScheduled ? null : (
          <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
            <dt className="text-[11px] text-text-subtle">Next due</dt>
            <dd className="text-right text-xs" style={{color: statusColor}}>
              {formatTaskDate(task.dueDate) ?? '—'}
            </dd>
          </div>
        )}
      </dl>
    </Card>
  );
}
