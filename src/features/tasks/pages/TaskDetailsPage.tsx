import { Link, useParams } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import TaskDetails from '../components/TaskDetails.tsx';
import TaskDetailsState from '../components/TaskDetailsState.tsx';
import useTasks from '../hooks/useTasks.ts';

export function TaskDetailsPage() {
  const {taskId} = useParams<{taskId: string}>();
  const {tasks, isLoading, error} = useTasks();
  const task = tasks.find(({id}) => id === taskId);

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

  return <TaskDetails task={task}/>;
}
