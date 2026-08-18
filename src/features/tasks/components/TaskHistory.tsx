import Card from '@/components/Card/Card.tsx';
import type { TaskHistoryEvent } from '../types/tasks.types.ts';
import { formatTaskDate } from '../utils/task-display.ts';
import { getTaskHistoryItem } from '../utils/task-history.ts';

interface TaskHistoryProps {
  events: readonly TaskHistoryEvent[];
}

export default function TaskHistory({events}: TaskHistoryProps) {
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
        {events.map((event) => {
          const {color, date, description, icon: Icon, note, title} = getTaskHistoryItem(event);

          return (
            <li
              className="grid grid-cols-[170px_minmax(0,1fr)] items-center py-3 max-[600px]:grid-cols-1 max-[600px]:gap-2"
              key={event.id}
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
                  {note && (
                    <p className="mt-1.5 whitespace-pre-wrap break-words text-[11px] leading-4 text-text-muted">
                      <span className="text-text-disabled">Note: </span>{note}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
