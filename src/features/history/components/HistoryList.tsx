import { LuChevronRight } from 'react-icons/lu';
import { Link } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Card from '@/components/Card/Card.tsx';
import { formatTaskDate } from '@/features/tasks/utils/task-display.ts';
import { getTaskHistoryItem } from '@/features/tasks/utils/task-history.ts';
import type { TaskHistoryFeedEvent } from '../types/history.types.ts';

interface HistoryListProps {
  events: readonly TaskHistoryFeedEvent[];
}

export default function HistoryList({events}: HistoryListProps) {
  return (
    <Card className="overflow-hidden p-0 shadow-none">
      <div
        aria-hidden="true"
        className="grid grid-cols-[150px_minmax(170px,0.75fr)_minmax(0,1.25fr)] border-b border-border-app bg-surface-hover px-6 py-3 text-[9px] tracking-[0.08em] text-text-disabled uppercase max-[760px]:hidden"
      >
        <span>Date</span>
        <span>Task</span>
        <span>What happened</span>
      </div>

      <ol className="divide-y divide-border-app px-6">
        {events.map((event) => {
          const {color, date, description, icon: Icon, note, title} = getTaskHistoryItem(event);
          const isDeletedTask = event.task.isDeleted;

          return (
            <li
              className="grid h-24 grid-cols-[150px_minmax(170px,0.75fr)_minmax(0,1.25fr)] items-center max-[760px]:h-auto max-[760px]:min-h-24 max-[760px]:grid-cols-1 max-[760px]:gap-3 max-[760px]:py-4"
              key={event.id}
            >
              <time className="flex flex-col gap-1 text-xs text-text-muted max-[760px]:flex-row max-[760px]:items-center" dateTime={date}>
                <span>{formatTaskDate(date) ?? '—'}</span>
              </time>

              <div className="min-w-0 pr-6 max-[760px]:pr-0">
                {isDeletedTask ? (
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-xs text-text-muted">{event.task.name}</span>
                    <span className="shrink-0 rounded-pill bg-danger-surface px-2 py-1 text-[8px] font-medium tracking-[0.06em] text-danger-text uppercase">
                      Deleted
                    </span>
                  </div>
                ) : (
                  <Link
                    aria-label={`View details for ${event.task.name}`}
                    className="group inline-flex max-w-full items-center gap-1.5 text-xs text-text-soft transition-colors hover:text-text-strong focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    state={{origin: 'history'}}
                    to={`${ROUTES.tasks}/${encodeURIComponent(event.task.id)}`}
                  >
                    <span className="truncate">{event.task.name}</span>
                    <LuChevronRight
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-text-disabled transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </Link>
                )}
              </div>

              <div className="flex min-w-0 items-start gap-3">
                <span
                  className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-pill bg-surface-hover"
                  style={{color}}
                >
                  <Icon className="size-3.5" aria-hidden="true"/>
                </span>
                <div className="min-w-0">
                  {note ? (
                    <>
                      <div className="flex min-w-0 items-baseline gap-2">
                        <h3 className="shrink-0 text-xs font-medium text-text-soft">{title}</h3>
                        <span className="shrink-0 text-[10px] text-text-disabled" aria-hidden="true">·</span>
                        <p className="truncate text-[11px] leading-4 text-text-subtle">{description}</p>
                      </div>
                      <p
                        className="mt-1 truncate text-[11px] leading-4 text-text-muted"
                        title={note}
                      >
                        <span className="mr-1.5 text-[9px] tracking-[0.06em] text-text-disabled uppercase">
                          Note
                        </span>
                        {note}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xs font-medium text-text-soft">{title}</h3>
                      <p className="mt-1 truncate text-[11px] leading-4 text-text-subtle">{description}</p>
                    </>
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
