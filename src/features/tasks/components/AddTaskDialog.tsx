import { lazy, Suspense, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import Button from '@/components/Button/Button.tsx'
import Dialog from '@/components/Dialog/Dialog.tsx'
import type { CreateTaskPayload } from '../types/tasks.types.ts'

const loadAddTaskDialogContent = () => import('./AddTaskDialogContent.tsx');
const AddTaskDialogContent = lazy(loadAddTaskDialogContent);

interface AddTaskDialogProps {
  error?: string | null;
  onAddNewTask: (task: CreateTaskPayload) => void | Promise<void>;
}

export default function AddTaskDialog({ error, onAddNewTask }: AddTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  function closeDialog() {
    setIsOpen(false)
  }

  function openDialog() {
    void loadAddTaskDialogContent().catch(() => undefined);
    setIsOpen(true);
  }

  return (
    <>
      <Button
        icon={LuPlus}
        label="Create task"
        onClick={openDialog}
      />

      {isOpen && (
        <Dialog isOpen={isOpen} onClose={closeDialog} title="Create task">
          <Suspense fallback={<p className="text-xs text-text-muted" role="status">Loading form...</p>}>
            <AddTaskDialogContent
              error={error}
              onAddNewTask={onAddNewTask}
              onClose={closeDialog}
            />
          </Suspense>
        </Dialog>
      )}
    </>
  )
}
