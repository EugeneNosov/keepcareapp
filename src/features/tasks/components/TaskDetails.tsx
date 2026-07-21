import { LuArrowLeft } from 'react-icons/lu';
import { Link } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import { TASK_STATUS_STYLES } from '../task.constants.ts';
import type { Task } from '../types/tasks.types.ts';
import TaskInformation from './TaskInformation.tsx';
import TaskNotes from './TaskNotes.tsx';
import TaskSchedule from './TaskSchedule.tsx';

interface TaskDetailsProps {
  task: Task;
}

export default function TaskDetails({task}: TaskDetailsProps) {
  const statusStyle = TASK_STATUS_STYLES[task.status];
  const StatusIcon = statusStyle.icon;

  return (
    <section className="mx-auto w-full max-w-275">
      <Link
        className="inline-flex items-center gap-2 text-[11px] text-text-subtle transition-colors hover:text-text-strong focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        to={ROUTES.tasks}
      >
        <LuArrowLeft className="size-3.5" aria-hidden="true"/>
        Back to tasks
      </Link>

      <header className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-border-app pb-8">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-medium tracking-[0.08em] text-primary uppercase">Task details</p>
          <h1 className="max-w-190 break-words text-[clamp(32px,5vw,52px)] leading-[1.05] font-medium tracking-[-0.05em] text-text-app">
            {task.name}
          </h1>
          <p className="mt-4 text-sm text-text-subtle">Review this task's key information, schedule, and notes.</p>
        </div>
        <span
          className="inline-flex h-9 items-center gap-2 rounded-pill px-3.5 text-[10px] font-medium tracking-[0.05em]"
          style={{
            backgroundColor: `color-mix(in srgb, ${statusStyle.color} 9%, transparent)`,
            color: statusStyle.color,
          }}
        >
          <StatusIcon className="size-3.5" aria-hidden="true"/>
          {statusStyle.label}
        </span>
      </header>

      <div className="mt-8 grid grid-cols-[minmax(0,1.4fr)_minmax(260px,0.75fr)] gap-5 max-[860px]:grid-cols-1">
        <TaskInformation task={task}/>
        <TaskSchedule task={task}/>
        <TaskNotes notes={task.notes}/>
      </div>
    </section>
  );
}
