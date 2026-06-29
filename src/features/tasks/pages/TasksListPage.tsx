import {
  LuCircleCheck,
  LuClock3,
  LuSearch,
  LuTriangleAlert,
} from 'react-icons/lu'
import AddTaskDialog from '../components/AddTaskDialog.tsx'
import TaskItem from '../components/TaskItem.tsx'
import useCreateTask from '../hooks/useCreateTask.ts'
import useTasks from '../hooks/useTasks.ts'
import type { Task } from '../types/tasks.types.ts';

const metrics = [
  {
    label: 'Overdue',
    value: '02',
    description: 'Require immediate action',
    icon: LuTriangleAlert,
    color: '#e36f5e',
    surface: '#25100e',
  },
  {
    label: 'Due soon',
    value: '03',
    description: 'Due within the next 24 hours',
    icon: LuClock3,
    color: '#f0a43c',
    surface: '#22170b',
  },
  {
    label: 'OK',
    value: '18',
    description: 'No action required',
    icon: LuCircleCheck,
    color: '#4bd49b',
    surface: '#0b2118',
  },
]

export function TasksListPage() {
  const {tasks, isLoading, error} = useTasks();
  const createTaskMutation = useCreateTask();

  async function handleCreateTask(task: Task) {
    await createTaskMutation.mutateAsync(task);
  }

  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <header className="border border-[#343734] bg-[#080909]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#242624] px-5 py-4">
          <div>
            <h1 className="mt-1.5 text-lg font-medium tracking-[0.05em] text-[#ededE8] uppercase">
              Tasks
            </h1>
          </div>
          <AddTaskDialog
            onAddNewTask={handleCreateTask}
          />
        </div>
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-[9px] tracking-[0.06em] text-[#8d918c] uppercase">
          <span>All registered tasks</span>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-3 gap-5 max-[860px]:grid-cols-1">
        {metrics.map(({label, value, description, icon: Icon, color, surface}) => (
          <article
            className="relative overflow-hidden border border-[#383b38] bg-[#080909] p-5 transition-colors hover:border-[#505450]"
            key={label}
          >
            <span className="absolute inset-y-0 left-0 w-0.5" style={{backgroundColor: color}}/>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.1em] text-[#939792] uppercase">{label}</span>
              <span
                className="grid size-8 place-items-center border"
                style={{backgroundColor: surface, borderColor: `${color}55`, color}}
              >
                <Icon className="size-4" aria-hidden="true"/>
              </span>
            </div>
            <strong className="mt-5 block text-3xl font-semibold tracking-[-0.04em] text-[#f2f2ed]">
              {value}
            </strong>
            <p className="mt-2 text-[10px] tracking-[0.03em] text-[#737772]">{description}</p>
          </article>
        ))}
      </div>

      <section className="mt-6 border border-[#383b38] bg-[#080909]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#303330] px-5 py-4">
          <h2
            className="flex items-center gap-2.5 text-xs font-medium tracking-[0.08em] text-[#e2e3de] uppercase before:block before:h-5 before:w-0.5 before:bg-[#f0783c]">
            Task registry
          </h2>
          <div className="flex items-center gap-4 max-[520px]:w-full">
            <label className="group relative max-[520px]:min-w-0 max-[520px]:flex-1">
              <span className="sr-only">Search tasks</span>
              <LuSearch
                className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#686c68] transition-colors group-focus-within:text-[#f0783c]"
                aria-hidden="true"
              />
              <input
                className="h-9 w-56 border border-[#343734] bg-[#0c0e0d] pr-3 pl-9 text-[11px] text-[#dcddd7] outline-none placeholder:text-[#626662] focus:border-[#7b4932] max-[520px]:w-full"
                placeholder="Search tasks..."
                type="search"
              />
            </label>
            <span className="shrink-0 text-[9px] tracking-[0.1em] text-[#747873] uppercase">
              {tasks.length.toString().padStart(2, '0')} {tasks.length === 1 ? 'record' : 'records'}
            </span>
          </div>
        </header>

        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div
              className="grid grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_minmax(150px,1fr)_32px] gap-4 border-b border-[#242624] px-5 py-3 text-[9px] tracking-[0.08em] text-[#70746f] uppercase">
              <span>Task name</span>
              <span>Status</span>
              <span>Scheduled for</span>
              <span/>
            </div>
            {isLoading && (
              <p className="px-5 py-6 text-[11px] text-[#747873]">Loading tasks...</p>
            )}
            {error && (
              <p className="px-5 py-6 text-[11px] text-[#e36f5e]" role="alert">{error}</p>
            )}
            {!isLoading && !error && tasks.length === 0 && (
              <p className="px-5 py-6 text-[11px] text-[#747873]">No tasks registered yet.</p>
            )}
            {tasks.map(task => <TaskItem task={task} key={task.id}/>)}
          </div>
        </div>
      </section>
    </section>
  )
}
