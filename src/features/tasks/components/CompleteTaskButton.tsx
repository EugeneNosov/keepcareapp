import { LuCheck } from 'react-icons/lu';
import type { TaskListItem } from '../types/tasks.types.ts';
import {
  isTaskCompletedToday,
  isTaskScheduled,
} from '../utils/task-display.ts';

interface CompleteTaskButtonProps {
  className?: string;
  isCompleting: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  task: TaskListItem;
}

export default function CompleteTaskButton({
                                             className,
                                             isCompleting,
                                             isDisabled = false,
                                             onClick,
                                             task,
                                           }: CompleteTaskButtonProps) {
  const isCompletedToday = isTaskCompletedToday(task);
  const isScheduled = isTaskScheduled(task);
  const completeLabel = isCompleting
    ? 'Saving...'
    : isScheduled
      ? 'Scheduled'
      : isCompletedToday
        ? 'Completed'
        : 'Complete';

  return (
    <button
      className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-pill bg-success-surface px-4 text-[11px] font-medium text-success transition-colors hover:bg-success-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-text-disabled ${className ?? ''}`}
      disabled={isDisabled || isScheduled || isCompletedToday}
      onClick={onClick}
      type="button"
    >
      <LuCheck className="size-3.5" aria-hidden="true"/>
      {completeLabel}
    </button>
  );
}
