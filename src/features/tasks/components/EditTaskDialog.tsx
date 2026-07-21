import { lazy, Suspense, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { LuPencil } from 'react-icons/lu';
import Dialog from '@/components/Dialog/Dialog.tsx';
import { taskDetailsQueryOptions } from '../task.queries.ts';
import type { TaskListItem, UpdateTaskPayload } from '../types/tasks.types.ts';

const loadEditTaskDialogContent = () => import('./EditTaskDialogContent.tsx');
const EditTaskDialogContent = lazy(loadEditTaskDialogContent);

interface EditTaskDialogProps {
  error?: string | null;
  isDisabled: boolean;
  onEditTask: (taskId: string, payload: UpdateTaskPayload) => void | Promise<void>;
  onResetError: () => void;
  task: TaskListItem;
}

export default function EditTaskDialog({
                                         error,
                                         isDisabled,
                                         onEditTask,
                                         onResetError,
                                         task,
                                       }: EditTaskDialogProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  function closeDialog() {
    onResetError();
    setIsOpen(false);
  }

  function openDialog() {
    onResetError();
    void queryClient.prefetchQuery(taskDetailsQueryOptions(task.id));
    void loadEditTaskDialogContent().catch(() => undefined);
    setIsOpen(true);
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
          <Suspense fallback={<p className="text-xs text-text-muted" role="status">Loading task details...</p>}>
            <EditTaskDialogContent
              error={error}
              onClose={closeDialog}
              onEditTask={onEditTask}
              taskId={task.id}
            />
          </Suspense>
        </Dialog>
      )}
    </>
  );
}
