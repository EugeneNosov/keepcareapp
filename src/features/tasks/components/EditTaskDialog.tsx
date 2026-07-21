import { useState } from 'react';
import { LuPencil } from 'react-icons/lu';
import Dialog from '@/components/Dialog/Dialog.tsx';
import useTaskDetails from '../hooks/useTaskDetails.ts';
import type { Task, TaskListItem, UpdateTaskPayload } from '../types/tasks.types.ts';
import TaskForm, { type TaskFormData } from './TaskForm.tsx';

interface EditTaskDialogProps {
  error?: string | null;
  isDisabled: boolean;
  onEditTask: (taskId: string, payload: UpdateTaskPayload) => void | Promise<void>;
  onResetError: () => void;
  task: TaskListItem;
}

function getTaskFormData(task: Task): TaskFormData {
  return {
    name: task.name,
    notes: task.notes ?? '',
    startsAt: task.startsAt.slice(0, 10),
    repeatEvery: {
      ...task.repeatEvery,
    },
  };
}

export default function EditTaskDialog({
                                         error,
                                         isDisabled,
                                         onEditTask,
                                         onResetError,
                                         task,
                                       }: EditTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    task: taskDetails,
    isLoading: areTaskDetailsLoading,
    error: taskDetailsError,
  } = useTaskDetails(task.id, isOpen);

  function closeDialog() {
    onResetError();
    setIsOpen(false);
  }

  function openDialog() {
    onResetError();
    setIsOpen(true);
  }

  async function handleEditTask(data: TaskFormData) {
    if (!taskDetails) {
      return;
    }

    const {name, notes, repeatEvery, startsAt} = data;
    const originalStartDate = taskDetails.startsAt.slice(0, 10);

    await onEditTask(taskDetails.id, {
      name,
      notes: notes?.trim() || undefined,
      repeatEvery,
      startsAt: startsAt === originalStartDate ? taskDetails.startsAt : startsAt,
    });
    closeDialog();
  }

  return (
    <>
      <button
        aria-label={`Edit ${task.name}`}
        className="grid size-10 cursor-pointer place-items-center rounded-pill bg-surface-raised text-text-muted transition-colors hover:bg-border-app hover:text-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isDisabled}
        onClick={openDialog}
        type="button"
      >
        <LuPencil className="size-3.5" aria-hidden="true"/>
      </button>

      {isOpen && (
        <Dialog isOpen={isOpen} onClose={closeDialog} title="Edit task">
          {taskDetails ? (
            <TaskForm
              defaultValues={getTaskFormData(taskDetails)}
              onCancel={closeDialog}
              onSubmit={handleEditTask}
              requestError={error}
              submitLabel="Save changes"
            />
          ) : taskDetailsError ? (
            <p className="text-sm text-danger" role="alert">{taskDetailsError}</p>
          ) : (
            <p className="text-xs text-text-muted" role="status">
              {areTaskDetailsLoading ? 'Loading task details...' : 'Task details are unavailable.'}
            </p>
          )}
        </Dialog>
      )}
    </>
  );
}
