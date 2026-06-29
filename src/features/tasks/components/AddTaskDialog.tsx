import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import Dialog from '../../../components/dialog/Dialog.tsx'
import type { Task } from '../types/tasks.types.ts'
import TaskForm, { type TaskFormData } from './TaskForm.tsx'

interface AddTaskDialogProps {
  onAddNewTask: (task: Task) => void | Promise<void>
}

export default function AddTaskDialog({onAddNewTask}: AddTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  function closeDialog() {
    setIsOpen(false)
  }

  async function handleCreateTask(data: TaskFormData) {
    await onAddNewTask({
      id: crypto.randomUUID(),
      ...data,
    })
    closeDialog()
  }

  return (
    <>
      <button
        className="inline-flex h-9 cursor-pointer items-center gap-2 border border-[#e16f3a] bg-[#e16f3a] px-3.5 text-[10px] font-medium tracking-[0.08em] text-[#100b08] uppercase transition-colors hover:border-[#f58a55] hover:bg-[#f58a55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0783c]"
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
            submitLabel="Create task"
          />
        </Dialog>
      )}
    </>
  )
}
