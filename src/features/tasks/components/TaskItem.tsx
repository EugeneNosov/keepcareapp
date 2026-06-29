import { LuCheck } from 'react-icons/lu'
import useMarkTaskAsCompleted from '../hooks/useMarkTaskAsCompleted.ts'
import { TASK_STATUS } from '../task.constants.ts'
import type { Task, TaskStatus } from '../types/tasks.types.ts'

const statusStyles: Record<TaskStatus, { label: string; color: string }> = {
  [TASK_STATUS.overdue]: {
    label: 'OVERDUE',
    color: '#e36f5e',
  },
  [TASK_STATUS.dueSoon]: {
    label: 'DUE SOON',
    color: '#f0a43c'
  },
  [TASK_STATUS.ok]: {
    label: 'OK',
    color: '#4bd49b'
  },
}

interface TaskItemProps {
  task: Task
}

function formatRepeatEvery({value, unit}: Task['repeatEvery']) {
  const unitLabel = value === 1 ? unit.slice(0, -1) : unit

  return `Every ${value} ${unitLabel}`
}

function formatDueDate(dueDate: string) {
  const parsedDueDate = new Date(dueDate)

  if (Number.isNaN(parsedDueDate.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDueDate)
}

function isSameCalendarDate(date: Date, comparisonDate: Date) {
  return date.getFullYear() === comparisonDate.getFullYear()
    && date.getMonth() === comparisonDate.getMonth()
    && date.getDate() === comparisonDate.getDate()
}

function isTaskCompletedToday(task: Task) {
  if (!task.lastCompletedAt) {
    return false;
  }

  const lastCompletedDate = new Date(task.lastCompletedAt);

  if (Number.isNaN(lastCompletedDate.getTime())) {
    return false;
  }

  return isSameCalendarDate(lastCompletedDate, new Date());
}

export default function TaskItem({task}: TaskItemProps) {
  const statusStyle = statusStyles[task.status]
  const markTaskAsCompletedMutation = useMarkTaskAsCompleted()
  const isCompletedToday = isTaskCompletedToday(task)
  const isCompleting = markTaskAsCompletedMutation.isPending
  const isCompleteButtonDisabled = isCompletedToday || isCompleting

  return (
    <div
      className="grid grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(140px,1fr)_150px] items-center gap-4 border-b border-[#202220] px-5 py-[18px] text-[11px] last:border-b-0 hover:bg-[#0d0f0e]"
    >
      <span className="text-[#dcddd7]">{task.name}</span>
      <span
        className="flex items-center gap-2 text-[9px] tracking-[0.04em]"
        style={{color: statusStyle.color}}
      >
        <i
          className="size-1.5 rounded-full not-italic"
          style={{backgroundColor: statusStyle.color}}
        />
        {statusStyle.label}
      </span>
      <span className="text-[#a4a7a2]">{formatRepeatEvery(task.repeatEvery)}</span>
      <span className="text-[#dcddd7]">{formatDueDate(task.dueDate)}</span>
      <button
        className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 border border-[#2c7f62] bg-[#0b2118] px-3 text-[9px] font-medium tracking-[0.06em] text-[#4bd49b] uppercase transition-colors hover:border-[#4bd49b] hover:bg-[#103424] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4bd49b] disabled:cursor-not-allowed disabled:border-[#313431] disabled:bg-[#151715] disabled:text-[#686c68]"
        disabled={isCompleteButtonDisabled}
        onClick={() => markTaskAsCompletedMutation.mutate(task.id)}
        type="button"
      >
        <LuCheck className="size-3.5" aria-hidden="true"/>
        {isCompleting ? 'Saving...' : isCompletedToday ? 'Completed' : 'Complete'}
      </button>
    </div>
  )
}
