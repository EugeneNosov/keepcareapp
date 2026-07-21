import useTaskDetails from '../hooks/useTaskDetails.ts';
import type { Task, UpdateTaskPayload } from '../types/tasks.types.ts';
import TaskForm, { type TaskFormData } from './TaskForm.tsx';

interface EditTaskDialogContentProps {
  error?: string | null;
  onClose: () => void;
  onEditTask: (taskId: string, payload: UpdateTaskPayload) => void | Promise<void>;
  taskId: string;
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

export default function EditTaskDialogContent({
                                                error,
                                                onClose,
                                                onEditTask,
                                                taskId,
                                              }: EditTaskDialogContentProps) {
  const {
    task,
    isLoading,
    error: taskDetailsError,
  } = useTaskDetails(taskId);

  async function handleEditTask(data: TaskFormData) {
    if (!task) {
      return;
    }

    const {name, notes, repeatEvery, startsAt} = data;
    const originalStartDate = task.startsAt.slice(0, 10);

    await onEditTask(task.id, {
      name,
      notes: notes?.trim() || undefined,
      repeatEvery,
      startsAt: startsAt === originalStartDate ? task.startsAt : startsAt,
    });
    onClose();
  }

  if (task) {
    return (
      <TaskForm
        defaultValues={getTaskFormData(task)}
        onCancel={onClose}
        onSubmit={handleEditTask}
        requestError={error}
        submitLabel="Save changes"
      />
    );
  }

  if (taskDetailsError) {
    return <p className="text-sm text-danger" role="alert">{taskDetailsError}</p>;
  }

  return (
    <p className="text-xs text-text-muted" role="status">
      {isLoading ? 'Loading task details...' : 'Task details are unavailable.'}
    </p>
  );
}
