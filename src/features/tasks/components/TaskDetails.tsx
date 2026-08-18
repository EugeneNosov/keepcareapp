import { useState } from 'react';
import { LuArrowLeft, LuHistory, LuLayoutGrid } from 'react-icons/lu';
import Tabs, { type TabItem } from '@/components/Tabs/Tabs.tsx';
import { TASK_STATUS_STYLES } from '../task.constants.ts';
import type {
  CompleteTaskPayload,
  Task,
  UpdateTaskPayload,
} from '../types/tasks.types.ts';
import CompleteTaskDialog from './CompleteTaskDialog.tsx';
import DeleteTaskDialog from './DeleteTaskDialog.tsx';
import EditTaskDialog from './EditTaskDialog.tsx';
import TaskHistorySection from './TaskHistorySection.tsx';
import TaskInformation from './TaskInformation.tsx';
import TaskNotes from './TaskNotes.tsx';
import TaskSchedule from './TaskSchedule.tsx';

interface TaskDetailsProps {
  actionError: string | null;
  isCompleting: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onBack: () => void;
  onComplete: (payload: CompleteTaskPayload) => void | Promise<void>;
  onDelete: (taskId: string, deleteHistory: boolean) => void;
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
                                      onBack,
                                      onComplete,
                                      onDelete,
                                      onEdit,
                                      onResetEditError,
                                      task,
                                      updateError,
                                    }: TaskDetailsProps) {
  const [activeTab, setActiveTab] = useState<TaskDetailsTab>('overview');
  const statusStyle = TASK_STATUS_STYLES[task.status];
  const StatusIcon = statusStyle.icon;
  const isActionPending = isCompleting || isDeleting || isUpdating;
  const tabs: readonly TabItem<TaskDetailsTab>[] = [
    {
      value: 'overview',
      label: 'Overview',
      icon: LuLayoutGrid,
      content: (
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(260px,0.75fr)] gap-5 max-[860px]:grid-cols-1">
          <TaskInformation task={task}/>
          <TaskSchedule task={task}/>
          <TaskNotes notes={task.notes}/>
        </div>
      ),
    },
    {
      value: 'history',
      label: 'Task history',
      icon: LuHistory,
      content: (
        <TaskHistorySection
          isEnabled={activeTab === 'history'}
          taskId={task.id}
        />
      ),
    },
  ];

  return (
    <section className="mx-auto w-full max-w-275">
      <button
        className="inline-flex items-center gap-2 text-[11px] text-text-subtle transition-colors hover:text-text-strong focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        onClick={onBack}
        type="button"
      >
        <LuArrowLeft className="size-3.5" aria-hidden="true"/>
        Back
      </button>

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
            <CompleteTaskDialog
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
            <p className="text-[10px] text-danger" role="alert">{actionError}</p>
          )}
        </div>
      </header>

      <Tabs
        ariaLabel="Task details sections"
        className="mt-6"
        items={tabs}
        onChange={setActiveTab}
        panelClassName="mt-5"
        value={activeTab}
      />
    </section>
  );
}
