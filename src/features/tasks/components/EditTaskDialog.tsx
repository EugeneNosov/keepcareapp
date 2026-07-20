import { useState } from 'react';
import { LuPencil } from 'react-icons/lu';
import Dialog from '@/components/Dialog/Dialog.tsx';
import type { Task, UpdateTaskPayload } from '../types/tasks.types.ts';
import TaskForm, { type TaskFormData } from './TaskForm.tsx';

interface EditTaskDialogProps {
  error?: string | null;
  isDisabled: boolean;
  onEditTask: (taskId: string, payload: UpdateTaskPayload) => void | Promise<void>;
  onResetError: () => void;
  task: Task;
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

  function closeDialog() {
    onResetError();
    setIsOpen(false);
  }

  function openDialog() {
    onResetError();
    setIsOpen(true);
  }

  async function handleEditTask(data: TaskFormData) {
    const {name, notes, repeatEvery, startsAt} = data;
    const originalStartDate = task.startsAt.slice(0, 10);

    await onEditTask(task.id, {
      name,
      notes: notes?.trim() || undefined,
      repeatEvery,
      startsAt: startsAt === originalStartDate ? task.startsAt : startsAt,
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
          <TaskForm
            defaultValues={getTaskFormData(task)}
            onCancel={closeDialog}
            onSubmit={handleEditTask}
            requestError={error}
            submitLabel="Save changes"
          />
        </Dialog>
      )}
    </>
  );
}
