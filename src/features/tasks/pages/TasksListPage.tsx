import { useCallback } from 'react';
import { isInlineRequestError } from '@/shared/api';
import AddTaskDialog from '../components/AddTaskDialog.tsx'
import TaskItem from '../components/TaskItem.tsx'
import TaskSummary from '../components/TaskSummary.tsx';
import useCreateTask from '../hooks/useCreateTask.ts'
import useDeleteTask from '../hooks/useDeleteTask.ts';
import useMarkTaskAsCompleted from '../hooks/useMarkTaskAsCompleted.ts';
import useTasks from '../hooks/useTasks.ts'
import type { CreateTaskPayload } from '../types/tasks.types.ts';

const summaryData = {
  overdueCount: 4,
  dueSoonCount: 1,
  okCount: 14,
};

export function TasksListPage() {
  const {tasks, isLoading, error} = useTasks();
  const createTaskMutation = useCreateTask();
  const completeTaskMutation = useMarkTaskAsCompleted();
  const deleteTaskMutation = useDeleteTask();
  const {mutate: completeTask} = completeTaskMutation;
  const {mutate: deleteTask} = deleteTaskMutation;
  const isTaskActionPending =
    completeTaskMutation.isPending || deleteTaskMutation.isPending;
  const createError = isInlineRequestError(createTaskMutation.error)
    ? createTaskMutation.error.message
    : null;

  async function handleCreateTask(task: CreateTaskPayload) {
    await createTaskMutation.mutateAsync(task);
  }

  const handleCompleteTask = useCallback((taskId: string) => {
    completeTask(taskId);
  }, [completeTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
  }, [deleteTask]);

  function getTaskActionError(taskId: string) {
    const mutationError =
      completeTaskMutation.variables === taskId
        ? completeTaskMutation.error
        : deleteTaskMutation.variables === taskId
          ? deleteTaskMutation.error
          : null;

    if (!mutationError) {
      return null;
    }

    return isInlineRequestError(mutationError)
      ? mutationError.message
      : null;
  }

  return (
    <section className="mx-auto w-full max-w-275">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs font-medium tracking-[0.08em] text-[#f0783c] uppercase">Your care list</p>
          <h1 className="text-[clamp(36px,5vw,56px)] leading-none font-medium tracking-[-0.055em] text-[#ededE8]">
            Tasks
          </h1>
          <p className="mt-4 text-sm text-[#858a84]">See what needs attention today.</p>
        </div>
        <AddTaskDialog error={createError} onAddNewTask={handleCreateTask}/>
      </header>

      <TaskSummary summaryData={summaryData}/>

      <section className="mt-10">
        <header className="mb-4 flex items-center justify-between gap-4 px-1">
          <h2 className="text-sm font-medium text-[#dfe0db]">All tasks</h2>
          <span className="text-xs text-[#777c76]">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </header>

        <div className="grid gap-3">
            {isLoading && (
              <p className="rounded-2xl bg-[#111311] px-5 py-6 text-xs text-[#747873]">Loading tasks...</p>
            )}
            {error && (
              <p className="rounded-2xl border border-[#63342f] bg-[#25100e] px-5 py-4 text-xs text-[#e36f5e]" role="alert">{error}</p>
            )}
            {!isLoading && !error && tasks.length === 0 && (
              <div className="rounded-3xl border border-dashed border-[#303330] px-6 py-14 text-center">
                <p className="text-sm text-[#b1b4af]">Your list is clear.</p>
                <p className="mt-2 text-xs text-[#686d68]">Create a recurring task to get started.</p>
              </div>
            )}
            {tasks.map((task) => (
              <TaskItem
                actionError={getTaskActionError(task.id)}
                isActionDisabled={isTaskActionPending}
                isCompleting={
                  completeTaskMutation.isPending
                  && completeTaskMutation.variables === task.id
                }
                isDeleting={
                  deleteTaskMutation.isPending
                  && deleteTaskMutation.variables === task.id
                }
                key={task.id}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                task={task}
              />
            ))}
        </div>
      </section>
    </section>
  )
}
