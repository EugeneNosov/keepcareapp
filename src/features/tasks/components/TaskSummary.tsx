import {
  LuCircleCheck,
  LuClock3,
  LuCalendarClock,
  LuTriangleAlert,
} from 'react-icons/lu';
import Card from '@/components/Card/Card.tsx';
import type { TaskSummary as TaskSummaryData } from '../types/tasks.types.ts';

type TaskSummaryProps = {
  summaryData: TaskSummaryData;
};

const metrics = [
  {
    label: 'Scheduled',
    icon: LuCalendarClock,
    color: 'var(--app-color-primary)',
    valueKey: 'scheduledCount',
  },
  {
    label: 'Overdue',
    icon: LuTriangleAlert,
    color: 'var(--app-color-danger)',
    valueKey: 'overdueCount',
  },
  {
    label: 'Due soon',
    icon: LuClock3,
    color: 'var(--app-color-warning)',
    valueKey: 'dueSoonCount',
  },
  {
    label: 'OK',
    icon: LuCircleCheck,
    color: 'var(--app-color-success)',
    valueKey: 'okCount',
  },
] as const;

export default function TaskSummary({summaryData}: TaskSummaryProps) {
  return (
    <Card className="mt-10 grid grid-cols-4 p-0 shadow-none max-[760px]:grid-cols-2 max-[520px]:grid-cols-1">
      {metrics.map(({label, icon: Icon, color, valueKey}) => (
        <article
          className="flex items-center gap-4 border-r border-border-app p-5 last:border-r-0 max-[760px]:border-b max-[760px]:even:border-r-0 max-[760px]:nth-last-[-n+2]:border-b-0 max-[520px]:border-r-0 max-[520px]:border-b max-[520px]:last:border-b-0"
          key={label}
        >
          <span className="grid size-10 place-items-center rounded-pill" style={{backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`, color}}>
            <Icon className="size-4" aria-hidden="true"/>
          </span>
          <div>
            <strong className="text-xl font-medium text-text-app">
              {summaryData[valueKey].toString().padStart(2, '0')}
            </strong>
            <p className="mt-1 text-[11px] text-text-subtle">{label}</p>
          </div>
        </article>
      ))}
    </Card>
  );
}
