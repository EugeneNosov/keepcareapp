import type { Task, TaskStatus } from '../types/tasks.types.ts'

const statusStyles: Record<TaskStatus, { label: string; color: string }> = {
  overdue: {
    label: 'OVERDUE',
    color: '#e36f5e',
  },
  due_soon: {
    label: 'DUE SOON',
    color: '#f0a43c'
  },
  ok: {
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

export default function TaskItem({task}: TaskItemProps) {
  const statusStyle = statusStyles[task.status]

  return (
    <div
      className="grid grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(140px,1fr)_32px] items-center gap-4 border-b border-[#202220] px-5 py-[18px] text-[11px] last:border-b-0 hover:bg-[#0d0f0e]"
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
    </div>
  )
}
