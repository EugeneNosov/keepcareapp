import type { CreateTaskPayload } from '../types/tasks.types.ts';
import TaskForm, { type TaskFormData } from './TaskForm.tsx';

interface AddTaskDialogContentProps {
  error?: string | null;
  onAddNewTask: (task: CreateTaskPayload) => void | Promise<void>;
  onClose: () => void;
}

export default function AddTaskDialogContent({
                                               error,
                                               onAddNewTask,
                                               onClose,
                                             }: AddTaskDialogContentProps) {
  async function handleCreateTask(data: TaskFormData) {
    const {name, notes, repeatEvery, startsAt} = data;

    await onAddNewTask({
      name,
      notes: notes?.trim() || undefined,
      repeatEvery,
      startsAt,
    });
    onClose();
  }

  return (
    <TaskForm
      onCancel={onClose}
      onSubmit={handleCreateTask}
      requestError={error}
      submitLabel="Create task"
    />
  );
}
