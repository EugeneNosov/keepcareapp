import { useId, useState } from 'react';
import { LuArrowLeft, LuHistory, LuLayoutGrid } from 'react-icons/lu';
import { Link } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import { TASK_STATUS_STYLES } from '../task.constants.ts';
import type { Task, UpdateTaskPayload } from '../types/tasks.types.ts';
import CompleteTaskButton from './CompleteTaskButton.tsx';
import DeleteTaskDialog from './DeleteTaskDialog.tsx';
import EditTaskDialog from './EditTaskDialog.tsx';
import TaskHistory from './TaskHistory.tsx';
import TaskInformation from './TaskInformation.tsx';
import TaskNotes from './TaskNotes.tsx';
import TaskSchedule from './TaskSchedule.tsx';

interface TaskDetailsProps {
  actionError: string | null;
  isCompleting: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, payload: UpdateTaskPayload) => void | Promise<void>;
  onResetEditError: () => void;
  task: Task;
  updateError: string | null;
}

type TaskDetailsTab = 'overview' | 'history';

export default function TaskDetails({
                                      actionError,
                                      isCompleting,
                                      isDeleting,
                                      isUpdating,
                                      onComplete,
                                      onDelete,
                                      onEdit,
                                      onResetEditError,
                                      task,
                                      updateError,
                                    }: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState<TaskDetailsTab>('overview');
  const tabId = useId();
  const statusStyle = TASK_STATUS_STYLES[task.status];
  const StatusIcon = statusStyle.icon;
  const isActionPending = isCompleting || isDeleting || isUpdating;

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
          <h1
            className="max-w-190 break-words text-[clamp(32px,5vw,52px)] leading-[1.05] font-medium tracking-[-0.05em] text-text-app">
            {task.name}
          </h1>
          <p className="mt-4 text-sm text-text-subtle">Review task details and activity.</p>
        </div>
        <div className="grid justify-items-end gap-2 max-[620px]:justify-items-start">
          <div className="flex flex-wrap items-center justify-end gap-2 max-[620px]:justify-start">
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
            <CompleteTaskButton
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
              onDelete={() => onDelete(task.id)}
              taskName={task.name}
            />
          </div>
          {actionError && (
            <p className="text-[10px] text-danger" role="alert">{actionError}</p>
          )}
        </div>
      </header>

      <div
        aria-label="Task details sections"
        className="mt-6 inline-flex rounded-control border border-border-app bg-surface p-1 max-[520px]:flex"
        role="tablist"
      >
        <button
          aria-controls={`${tabId}-overview-panel`}
          aria-selected={activeTab === 'overview'}
          className={`inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[9px] px-4 text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-[520px]:flex-1 max-[520px]:gap-1.5 max-[520px]:px-2 ${
            activeTab === 'overview'
              ? 'bg-surface-muted text-text-strong'
              : 'text-text-subtle hover:bg-surface-hover hover:text-text-soft'
          }`}
          id={`${tabId}-overview-tab`}
          onClick={() => setActiveTab('overview')}
          role="tab"
          type="button"
        >
          <LuLayoutGrid className={`size-3.5 ${activeTab === 'overview' ? 'text-primary' : ''}`} aria-hidden="true"/>
          Overview
        </button>
        <button
          aria-controls={`${tabId}-history-panel`}
          aria-selected={activeTab === 'history'}
          className={`inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[9px] px-4 text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-[520px]:flex-1 max-[520px]:gap-1.5 max-[520px]:px-2 ${
            activeTab === 'history'
              ? 'bg-surface-muted text-text-strong'
              : 'text-text-subtle hover:bg-surface-hover hover:text-text-soft'
          }`}
          id={`${tabId}-history-tab`}
          onClick={() => setActiveTab('history')}
          role="tab"
          type="button"
        >
          <LuHistory className={`size-3.5 ${activeTab === 'history' ? 'text-primary' : ''}`} aria-hidden="true"/>
          Task history
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div
          aria-labelledby={`${tabId}-overview-tab`}
          className="mt-5 grid grid-cols-[minmax(0,1.4fr)_minmax(260px,0.75fr)] gap-5 max-[860px]:grid-cols-1"
          id={`${tabId}-overview-panel`}
          role="tabpanel"
        >
          <TaskInformation task={task}/>
          <TaskSchedule task={task}/>
          <TaskNotes notes={task.notes}/>
        </div>
      ) : (
        <div
          aria-labelledby={`${tabId}-history-tab`}
          className="mt-5"
          id={`${tabId}-history-panel`}
          role="tabpanel"
        >
          <TaskHistory task={task}/>
        </div>
      )}
    </section>
  );
}
