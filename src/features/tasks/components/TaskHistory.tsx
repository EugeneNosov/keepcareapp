import type { IconType } from 'react-icons';
import {
  LuCalendarClock,
  LuCircleCheck,
  LuCirclePlus,
} from 'react-icons/lu';
import Card from '@/components/Card/Card.tsx';
import type { Task } from '../types/tasks.types.ts';
import { formatRepeatEvery, formatTaskDate } from '../utils/task-display.ts';

interface TaskHistoryProps {
  task: Task;
}

interface HistoryItem {
  color: string;
  date: string;
  description: string;
  icon: IconType;
  title: string;
}

function getHistoryItems(task: Task): HistoryItem[] {
  const items: HistoryItem[] = [];

  if (task.lastCompletedAt) {
    const nextDueDate = formatTaskDate(task.dueDate);

    items.push({
      color: 'var(--app-color-success)',
      date: task.lastCompletedAt,
      description: nextDueDate ? `Next due date: ${nextDueDate}.` : 'The task was marked as done.',
      icon: LuCircleCheck,
      title: 'Task completed',
    });
  }

  const startsAt = new Date(task.startsAt);

  if (!Number.isNaN(startsAt.getTime()) && startsAt.getTime() <= Date.now()) {
    items.push({
      color: 'var(--app-color-primary)',
      date: task.startsAt,
      description: `${formatRepeatEvery(task.repeatEvery)} schedule started.`,
      icon: LuCalendarClock,
      title: 'Schedule started',
    });
  }

  items.push({
    color: 'var(--app-color-text-subtle)',
    date: task.createdAt,
    description: 'The task was added to your care list.',
    icon: LuCirclePlus,
    title: 'Task created',
  });

  return items.sort((first, second) => (
    new Date(second.date).getTime() - new Date(first.date).getTime()
  ));
}

export default function TaskHistory({task}: TaskHistoryProps) {
  const historyItems = getHistoryItems(task);

  return (
    <Card className="overflow-hidden p-0 shadow-none">
      <header className="border-b border-border-app px-6 py-5">
        <h2 className="text-sm font-medium text-text-soft">Task history</h2>
        <p className="mt-1.5 text-[11px] text-text-subtle">Dates and changes for this task.</p>
      </header>

      <div
        className="grid grid-cols-[170px_minmax(0,1fr)] border-b border-border-app bg-surface-hover px-6 py-3 text-[9px] tracking-[0.08em] text-text-disabled uppercase max-[600px]:hidden"
        aria-hidden="true"
      >
        <span>Date</span>
        <span>What happened</span>
      </div>

      <ol className="divide-y divide-border-app px-6">
        {historyItems.map(({color, date, description, icon: Icon, title}) => (
          <li
            className="grid grid-cols-[170px_minmax(0,1fr)] items-center py-3 max-[600px]:grid-cols-1 max-[600px]:gap-2"
            key={`${title}-${date}`}
          >
            <time className="text-xs text-text-muted" dateTime={date}>
              {formatTaskDate(date) ?? '—'}
            </time>

            <div className="flex min-w-0 items-start gap-3">
              <span
                className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-pill bg-surface-hover"
                style={{color}}
              >
                <Icon className="size-3.5" aria-hidden="true"/>
              </span>
              <div className="min-w-0">
                <h3 className="text-xs font-medium text-text-soft">{title}</h3>
                <p className="mt-1 text-[11px] leading-4 text-text-subtle">{description}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
