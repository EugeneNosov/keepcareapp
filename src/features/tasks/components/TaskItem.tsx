import { memo } from 'react';
import { LuCheck, LuCircleCheck, LuClock3, LuTrash2, LuTriangleAlert } from 'react-icons/lu';
import { TASK_STATUS } from '../task.constants.ts';
import type { Task, TaskStatus } from '../types/tasks.types.ts';

const statusStyles: Record<TaskStatus, { label: string; color: string; icon: typeof LuClock3 }> = {
  [TASK_STATUS.overdue]: {
    label: 'OVERDUE',
    color: '#e36f5e',
    icon: LuTriangleAlert,
  },
  [TASK_STATUS.dueSoon]: {
    label: 'DUE SOON',
    color: '#f0a43c',
    icon: LuClock3,
  },
  [TASK_STATUS.ok]: {
    label: 'OK',
    color: '#4bd49b',
    icon: LuCircleCheck,
  },
}

const taskDateFormatter = new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

interface TaskItemProps {
  task: Task;
  actionError: string | null;
  isActionDisabled: boolean;
  isCompleting: boolean;
  isDeleting: boolean;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

function formatRepeatEvery({value, unit}: Task['repeatEvery']) {
  const unitLabel = value === 1 ? unit.slice(0, -1) : unit

  return `Every ${value} ${unitLabel}`
}

function formatDueDate(dueDate: string) {
  const parsedDueDate = new Date(dueDate)

  if (Number.isNaN(parsedDueDate.getTime())) {
    return '—'
  }

  return taskDateFormatter.format(parsedDueDate)
}

function isSameCalendarDate(date: Date, comparisonDate: Date) {
  return date.getFullYear() === comparisonDate.getFullYear()
    && date.getMonth() === comparisonDate.getMonth()
    && date.getDate() === comparisonDate.getDate()
}

function isTaskCompletedToday(task: Task) {
  if (!task.lastCompletedAt) {
    return false;
  }

  const lastCompletedDate = new Date(task.lastCompletedAt);

  if (Number.isNaN(lastCompletedDate.getTime())) {
    return false;
  }

  return isSameCalendarDate(lastCompletedDate, new Date());
}

function TaskItem({
                    task,
                    actionError,
                    isActionDisabled,
                    isCompleting,
                    isDeleting,
                    onComplete,
                    onDelete,
                  }: TaskItemProps) {
  const statusStyle = statusStyles[task.status];
  const StatusIcon = statusStyle.icon;
  const isCompletedToday = isTaskCompletedToday(task);
  const isCompleteButtonDisabled = isCompletedToday || isActionDisabled;

  function handleDelete() {
    if (window.confirm(`Delete "${task.name}"?`)) {
      onDelete(task.id);
    }
  }

  return (
    <article
      className="grid grid-cols-[minmax(0,1.5fr)_minmax(220px,0.8fr)_auto] items-center gap-6 rounded-2xl border border-transparent bg-[#111311] p-4 transition-colors hover:border-[#292c29] hover:bg-[#151715] max-[760px]:grid-cols-1 max-[760px]:gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full"
              style={{backgroundColor: `${statusStyle.color}14`, color: statusStyle.color}}>
          <StatusIcon className="size-4" aria-hidden="true"/>
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm text-[#dcddd7]">{task.name}</h3>
          <p className="mt-1.5 text-[11px] text-[#737873]">{formatRepeatEvery(task.repeatEvery)}</p>
        </div>
      </div>
      <div className="max-[760px]:pl-14">
        <p className="text-[10px] text-[#686d68]">Next due</p>
        <p className="mt-1 text-xs text-[#b7bab5]">{formatDueDate(task.dueDate)} <span className="ml-2"
                                                                                       style={{color: statusStyle.color}}>{statusStyle.label}</span>
        </p>
      </div>
      <div className="grid min-w-50 gap-2 max-[760px]:min-w-0">
        <div className="flex gap-2">
          <button
            className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1a2c23] px-4 text-[11px] font-medium text-[#65c99b] transition-colors hover:bg-[#213a2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4bd49b] disabled:cursor-not-allowed disabled:bg-[#191b19] disabled:text-[#686c68]"
            disabled={isCompleteButtonDisabled}
            onClick={() => onComplete(task.id)}
            type="button"
          >
            <LuCheck className="size-3.5" aria-hidden="true"/>
            {isCompleting ? 'Saving...' : isCompletedToday ? 'Completed' : 'Complete'}
          </button>
          <button
            aria-label={isDeleting ? `Deleting ${task.name}` : `Delete ${task.name}`}
            className="grid size-10 cursor-pointer place-items-center rounded-full bg-[#201716] text-[#b86358] transition-colors hover:bg-[#321c19] hover:text-[#e36f5e] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isActionDisabled}
            onClick={handleDelete}
            type="button"
          >
            <LuTrash2 className="size-3.5" aria-hidden="true"/>
          </button>
        </div>
        {actionError && (
          <span className="text-[9px] leading-4 text-[#e36f5e]" role="alert">
            {actionError}
          </span>
        )}
      </div>
    </article>
  );
}

export default memo(TaskItem);
