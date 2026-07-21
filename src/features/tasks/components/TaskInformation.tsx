import Card from '@/components/Card/Card.tsx';
import type { Task } from '../types/tasks.types.ts';
import { formatTaskDate } from '../utils/task-display.ts';

interface TaskInformationProps {
  task: Task;
}

export default function TaskInformation({task}: TaskInformationProps) {
  return (
    <Card className="p-6 shadow-none">
      <h2 className="text-sm font-medium text-text-soft">Task information</h2>
      <dl className="mt-5 divide-y divide-border-app">
        <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
          <dt className="text-[11px] text-text-subtle">Created</dt>
          <dd className="text-right text-xs text-text-soft">
            {formatTaskDate(task.createdAt) ?? '—'}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
          <dt className="text-[11px] text-text-subtle">Last completed</dt>
          <dd className="text-right text-xs text-text-soft">
            {formatTaskDate(task.lastCompletedAt) ?? 'Not completed yet'}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
