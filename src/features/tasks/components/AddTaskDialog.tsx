import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import Dialog from '@/components/Dialog/Dialog.tsx'
import type { CreateTaskPayload } from '../types/tasks.types.ts'
import TaskForm, { type TaskFormData } from './TaskForm.tsx'

interface AddTaskDialogProps {
  error?: string | null;
  onAddNewTask: (task: CreateTaskPayload) => void | Promise<void>;
}

export default function AddTaskDialog({ error, onAddNewTask }: AddTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  function closeDialog() {
    setIsOpen(false)
  }

  async function handleCreateTask(data: TaskFormData) {
    await onAddNewTask(data)
    closeDialog()
  }

  return (
    <>
      <button
        className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[#f0783c] px-5 text-sm font-medium text-[#160b06] transition-colors hover:bg-[#ff8a4f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0783c]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <LuPlus className="size-4" aria-hidden="true"/>
        Create task
      </button>

      {isOpen && (
        <Dialog isOpen={isOpen} onClose={closeDialog} title="Create task">
          <TaskForm
            onCancel={closeDialog}
            onSubmit={handleCreateTask}
            requestError={error}
            submitLabel="Create task"
          />
        </Dialog>
      )}
    </>
  )
}
