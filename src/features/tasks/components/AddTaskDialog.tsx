import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import Button from '@/components/Button/Button.tsx'
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
    const {name, notes, repeatEvery, startsAt} = data

    await onAddNewTask({
      name,
      notes: notes?.trim() || undefined,
      repeatEvery,
      startsAt,
    })
    closeDialog()
  }

  return (
    <>
      <Button
        icon={LuPlus}
        label="Create task"
        onClick={() => setIsOpen(true)}
      />

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
