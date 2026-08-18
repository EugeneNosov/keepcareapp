import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import { isInlineRequestError } from '@/shared/api';
import TaskDetails from '../components/TaskDetails.tsx';
import TaskDetailsState from '../components/TaskDetailsState.tsx';
import useDeleteTask from '../hooks/useDeleteTask.ts';
import useMarkTaskAsCompleted from '../hooks/useMarkTaskAsCompleted.ts';
import useTaskDetails from '../hooks/useTaskDetails.ts';
import useUpdateTask from '../hooks/useUpdateTask.ts';
import type {
  CompleteTaskPayload,
  UpdateTaskPayload,
} from '../types/tasks.types.ts';

export function TaskDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {taskId = ''} = useParams<{taskId: string}>();
  const {task, isLoading, error} = useTaskDetails(taskId);
  const completeTaskMutation = useMarkTaskAsCompleted();
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();
  const completeError = isInlineRequestError(completeTaskMutation.error)
    ? completeTaskMutation.error.message
    : null;
  const updateError = isInlineRequestError(updateTaskMutation.error)
    ? updateTaskMutation.error.message
    : null;
  const deleteError = isInlineRequestError(deleteTaskMutation.error)
    ? deleteTaskMutation.error.message
    : null;

  async function handleCompleteTask(payload: CompleteTaskPayload) {
    await completeTaskMutation.mutateAsync(payload);
  }

  function handleBack() {
    const navigationState = location.state as {
      origin?: 'history' | 'tasks';
    } | null;

    if (navigationState?.origin === 'history' || navigationState?.origin === 'tasks') {
      navigate(-1);
      return;
    }

    navigate(ROUTES.tasks, {replace: true});
  }

  function handleDeleteTask(currentTaskId: string, deleteHistory: boolean) {
    deleteTaskMutation.mutate({taskId: currentTaskId, deleteHistory}, {
      onSuccess: () => navigate(ROUTES.tasks, {replace: true}),
    });
  }

  async function handleUpdateTask(
    currentTaskId: string,
    payload: UpdateTaskPayload,
  ) {
    await updateTaskMutation.mutateAsync({taskId: currentTaskId, payload});
  }

  if (isLoading) {
    return (
      <TaskDetailsState>
        <p className="text-[10px] tracking-widest text-text-muted uppercase">Loading task details...</p>
      </TaskDetailsState>
    );
  }

  if (error) {
    return (
      <TaskDetailsState role="alert">
        <p className="text-sm text-danger">{error}</p>
        <Link
          className="mt-4 inline-flex text-xs text-text-muted underline underline-offset-4 hover:text-text-strong"
          to={ROUTES.tasks}
        >
          Return to tasks
        </Link>
      </TaskDetailsState>
    );
  }

  if (!task) {
    return (
      <TaskDetailsState role="alert">
        <p className="text-sm text-text-soft">Task not found.</p>
        <p className="mt-2 text-xs text-text-subtle">It may have been removed or the link is no longer valid.</p>
        <Link
          className="mt-4 inline-flex text-xs text-primary underline underline-offset-4 hover:text-primary-hover"
          to={ROUTES.tasks}
        >
          Return to tasks
        </Link>
      </TaskDetailsState>
    );
  }

  return (
    <TaskDetails
      actionError={deleteError ?? completeError}
      isCompleting={completeTaskMutation.isPending}
      isDeleting={deleteTaskMutation.isPending}
      isUpdating={updateTaskMutation.isPending}
      onBack={handleBack}
      onComplete={handleCompleteTask}
      onDelete={handleDeleteTask}
      onEdit={handleUpdateTask}
      onResetEditError={updateTaskMutation.reset}
      task={task}
      updateError={updateError}
    />
  );
}
