import { memo } from 'react';
import { LuChevronRight } from 'react-icons/lu';
import { Link } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import { TASK_STATUS_STYLES } from '../task.constants.ts';
import type {
  CompleteTaskPayload,
  TaskListItem,
  UpdateTaskPayload,
} from '../types/tasks.types.ts';
import {
  formatRepeatEvery,
  formatTaskDate,
  isTaskScheduled,
} from '../utils/task-display.ts';
import CompleteTaskDialog from './CompleteTaskDialog.tsx';
import DeleteTaskDialog from './DeleteTaskDialog.tsx';
import EditTaskDialog from './EditTaskDialog.tsx';

interface TaskItemProps {
  task: TaskListItem;
  actionError: string | null;
  isCompleting: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onComplete: (payload: CompleteTaskPayload) => void | Promise<void>;
  onDelete: (taskId: string, deleteHistory: boolean) => void;
  onEdit: (taskId: string, payload: UpdateTaskPayload) => void | Promise<void>;
  onResetEditError: () => void;
  updateError: string | null;
}

function TaskItem({
                    task,
                    actionError,
                    isCompleting,
                    isDeleting,
                    isUpdating,
                    onComplete,
                    onDelete,
                    onEdit,
                    onResetEditError,
                    updateError,
                  }: TaskItemProps) {
  const statusStyle = TASK_STATUS_STYLES[task.status];
  const StatusIcon = statusStyle.icon;
  const isScheduled = isTaskScheduled(task);
  const isActionPending = isCompleting || isDeleting || isUpdating;
  const displayedDate = isScheduled ? task.startsAt : task.dueDate;

  return (
    <article
      className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_auto] items-center gap-6 rounded-card border border-transparent bg-surface p-4 transition-colors hover:border-border-app hover:bg-surface-hover @max-[760px]:grid-cols-[minmax(0,1fr)_auto] @max-[760px]:gap-x-6 @max-[760px]:gap-y-2 @max-[480px]:grid-cols-1 @max-[480px]:gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-pill"
              style={{
                backgroundColor: `color-mix(in srgb, ${statusStyle.color} 8%, transparent)`,
                color: statusStyle.color
              }}>
          <StatusIcon className="size-4" aria-hidden="true"/>
        </span>
        <div className="min-w-0">
          <h3 className="min-w-0">
            <Link
              aria-label={`View details for ${task.name}`}
              className="group flex min-w-0 items-center gap-1.5 text-sm text-text-soft transition-colors hover:text-text-strong focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              state={{origin: 'tasks'}}
              to={`${ROUTES.tasks}/${encodeURIComponent(task.id)}`}
            >
              <span className="truncate">{task.name}</span>
              <LuChevronRight
                aria-hidden="true"
                className="size-3.5 shrink-0 text-text-disabled transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>
          </h3>
          <p className="mt-1.5 text-[11px] text-text-subtle">{formatRepeatEvery(task.repeatEvery)}</p>
        </div>
      </div>
      <div
        className="@max-[760px]:col-start-1 @max-[760px]:pl-14 @max-[760px]:flex @max-[760px]:flex-wrap @max-[760px]:items-baseline @max-[760px]:gap-x-2">
        <p className="text-[10px] text-text-disabled">{isScheduled ? 'Starts' : 'Next due'}</p>
        <p className="mt-1 text-xs text-text-muted @max-[760px]:mt-0">{formatTaskDate(displayedDate) ?? '—'}</p>
      </div>
      <div
        className="grid min-w-50 gap-2 @max-[760px]:col-start-2 @max-[760px]:row-start-1 @max-[760px]:row-span-2 @max-[760px]:self-center @max-[480px]:col-start-1 @max-[480px]:row-start-3 @max-[480px]:row-span-1 @max-[480px]:min-w-0">
        <div className="flex gap-2">
          <CompleteTaskDialog
            className="flex-1"
            isCompleting={isCompleting}
            isDisabled={isActionPending}
            onComplete={onComplete}
            task={task}
          />
          <EditTaskDialog
            error={updateError}
            isDisabled={isActionPending}
            onEditTask={onEdit}
            onResetError={onResetEditError}
            task={task}
          />
          <DeleteTaskDialog
            isDeleting={isDeleting}
            isDisabled={isActionPending}
            onDelete={(deleteHistory) => onDelete(task.id, deleteHistory)}
            taskName={task.name}
          />
        </div>
        {actionError && (
          <span className="text-[9px] leading-4 text-danger" role="alert">
            {actionError}
          </span>
        )}
      </div>
    </article>
  );
}

export default memo(TaskItem);
