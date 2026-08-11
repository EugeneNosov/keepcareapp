import { useCallback, useState } from 'react';
import { isInlineRequestError } from '@/shared/api';
import AddTaskDialog from '../components/AddTaskDialog.tsx';
import TaskItem from '../components/TaskItem.tsx';
import TaskSummary from '../components/TaskSummary.tsx';
import useCreateTask from '../hooks/useCreateTask.ts';
import useDeleteTask from '../hooks/useDeleteTask.ts';
import useMarkTaskAsCompleted from '../hooks/useMarkTaskAsCompleted.ts';
import useTasks from '../hooks/useTasks.ts';
import useTaskSummary from '../hooks/useTaskSummary.ts';
import useUpdateTask from '../hooks/useUpdateTask.ts';
import type { CreateTaskPayload, UpdateTaskPayload } from '../types/tasks.types.ts';

function updateTaskIdSet(
  taskIds: ReadonlySet<string>,
  taskId: string,
  shouldInclude: boolean,
) {
  if (taskIds.has(taskId) === shouldInclude) {
    return taskIds;
  }

  const nextTaskIds = new Set(taskIds);

  if (shouldInclude) {
    nextTaskIds.add(taskId);
  } else {
    nextTaskIds.delete(taskId);
  }

  return nextTaskIds;
}

function updateTaskError(
  taskErrors: ReadonlyMap<string, string>,
  taskId: string,
  error: string | null,
) {
  if ((taskErrors.get(taskId) ?? null) === error) {
    return taskErrors;
  }

  const nextTaskErrors = new Map(taskErrors);

  if (error) {
    nextTaskErrors.set(taskId, error);
  } else {
    nextTaskErrors.delete(taskId);
  }

  return nextTaskErrors;
}

export function TasksListPage() {
  const {tasks, isLoading, error} = useTasks();
  const {summaryData, error: summaryError} = useTaskSummary();
  const createTaskMutation = useCreateTask();
  const completeTaskMutation = useMarkTaskAsCompleted();
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();
  const {mutateAsync: completeTask} = completeTaskMutation;
  const {mutateAsync: deleteTask} = deleteTaskMutation;
  const {mutateAsync: updateTask, reset: resetUpdateTask} = updateTaskMutation;
  const [completingTaskIds, setCompletingTaskIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [deletingTaskIds, setDeletingTaskIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [taskActionErrors, setTaskActionErrors] = useState<ReadonlyMap<string, string>>(
    () => new Map(),
  );
  const createError = isInlineRequestError(createTaskMutation.error)
    ? createTaskMutation.error.message
    : null;
  const updateError = isInlineRequestError(updateTaskMutation.error)
    ? updateTaskMutation.error.message
    : null;

  async function handleCreateTask(task: CreateTaskPayload) {
    await createTaskMutation.mutateAsync(task);
  }

  const handleUpdateTask = useCallback(async (
    taskId: string,
    payload: UpdateTaskPayload,
  ) => {
    await updateTask({taskId, payload});
  }, [updateTask]);

  const handleResetUpdateTask = useCallback(() => {
    resetUpdateTask();
  }, [resetUpdateTask]);

  const handleCompleteTask = useCallback(async (taskId: string) => {
    setTaskActionErrors((taskErrors) => updateTaskError(taskErrors, taskId, null));
    setCompletingTaskIds((taskIds) => updateTaskIdSet(taskIds, taskId, true));

    try {
      await completeTask(taskId);
    } catch (error) {
      if (isInlineRequestError(error)) {
        setTaskActionErrors((taskErrors) =>
          updateTaskError(taskErrors, taskId, error.message)
        );
      }
    } finally {
      setCompletingTaskIds((taskIds) => updateTaskIdSet(taskIds, taskId, false));
    }
  }, [completeTask]);

  const handleDeleteTask = useCallback(async (
    taskId: string,
    deleteHistory: boolean,
  ) => {
    setTaskActionErrors((taskErrors) => updateTaskError(taskErrors, taskId, null));
    setDeletingTaskIds((taskIds) => updateTaskIdSet(taskIds, taskId, true));

    try {
      await deleteTask({taskId, deleteHistory});
    } catch (error) {
      if (isInlineRequestError(error)) {
        setTaskActionErrors((taskErrors) =>
          updateTaskError(taskErrors, taskId, error.message)
        );
      }
    } finally {
      setDeletingTaskIds((taskIds) => updateTaskIdSet(taskIds, taskId, false));
    }
  }, [deleteTask]);

  return (
    <section className="mx-auto w-full max-w-275">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs font-medium tracking-[0.08em] text-primary uppercase">Your care list</p>
          <h1 className="text-[clamp(36px,5vw,56px)] leading-none font-medium tracking-[-0.055em] text-text-app">
            Tasks
          </h1>
          <p className="mt-4 text-sm text-text-subtle">See what needs attention today.</p>
        </div>
        <AddTaskDialog error={createError} onAddNewTask={handleCreateTask}/>
      </header>

      <TaskSummary summaryData={summaryData}/>
      {summaryError && (
        <p className="mt-3 rounded-card border border-danger-border bg-danger-surface px-5 py-4 text-xs text-danger"
           role="alert">
          {summaryError}
        </p>
      )}

      <section className="mt-10">
        <header className="mb-4 flex items-center justify-between gap-4 px-1">
          <h2 className="text-sm font-medium text-text-soft">All tasks</h2>
          <span className="text-xs text-text-subtle">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </header>

        <div className="grid gap-3">
          {isLoading && (
            <p className="rounded-card bg-surface px-5 py-6 text-xs text-text-subtle">Loading tasks...</p>
          )}
          {error && (
            <p className="rounded-card border border-danger-border bg-danger-surface px-5 py-4 text-xs text-danger"
               role="alert">{error}</p>
          )}
          {!isLoading && !error && tasks.length === 0 && (
            <div className="rounded-card border border-dashed border-border-muted px-6 py-14 text-center">
              <p className="text-sm text-text-muted">Your list is clear.</p>
              <p className="mt-2 text-xs text-text-disabled">Create a recurring task to get started.</p>
            </div>
          )}
          {tasks.map((task) => (
            <TaskItem
              actionError={taskActionErrors.get(task.id) ?? null}
              isCompleting={completingTaskIds.has(task.id)}
              isDeleting={deletingTaskIds.has(task.id)}
              isUpdating={
                updateTaskMutation.isPending
                && updateTaskMutation.variables?.taskId === task.id
              }
              key={task.id}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onEdit={handleUpdateTask}
              onResetEditError={handleResetUpdateTask}
              task={task}
              updateError={
                updateTaskMutation.variables?.taskId === task.id
                  ? updateError
                  : null
              }
            />
          ))}
        </div>
      </section>
    </section>
  );
}
