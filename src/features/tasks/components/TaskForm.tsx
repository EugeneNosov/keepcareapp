import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TASK_STATUSES } from '../task.constants.ts'

const taskFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Task name is required')
    .max(50, 'Task name must be less than 50 characters'),
  status: z.enum(TASK_STATUSES),
  scheduledFor: z.string().min(1, 'Scheduled date is required'),
})

export type TaskFormData = z.infer<typeof taskFormSchema>

interface TaskFormProps {
  defaultValues?: TaskFormData
  onCancel: () => void
  onSubmit: (data: TaskFormData) => void | Promise<void>
  submitLabel: string
}

const initialTaskFormData: TaskFormData = {
  name: '',
  status: 'ok',
  scheduledFor: '',
}

const fieldClassName = 'h-10 w-full border border-[#343734] bg-[#0c0e0d] px-3 text-[11px] text-[#dcddd7] outline-none transition-colors focus:border-[#a8552f] focus:ring-1 focus:ring-[#a8552f]'
const labelClassName = 'text-[9px] font-medium tracking-[0.08em] text-[#989c97] uppercase'

export default function TaskForm({
                                   defaultValues = initialTaskFormData,
                                   onCancel,
                                   onSubmit,
                                   submitLabel,
                                 }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting, isValid},
  } = useForm<TaskFormData>({
    defaultValues,
    resolver: zodResolver(taskFormSchema),
    mode: 'onChange',
  })

  async function handleFormSubmit(data: TaskFormData) {
    await onSubmit(data)
    reset(defaultValues)
  }

  function handleCancel() {
    reset(defaultValues)
    onCancel()
  }

  const errorMessages = Object.values(errors)
    .map(error => error.message)
    .filter(Boolean)

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(handleFormSubmit)}>
      <label className="flex flex-col gap-2">
        <span className={labelClassName}>Task name</span>
        <input
          className={fieldClassName}
          placeholder="Enter task name"
          type="text"
          {...register('name')}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClassName}>Status</span>
          <select className={fieldClassName} {...register('status')}>
            <option value="ok">OK</option>
            <option value="due_soon">Due soon</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClassName}>Scheduled for</span>
          <input className={fieldClassName} type="date" {...register('scheduledFor')}/>
        </label>
      </div>

      {errorMessages.length > 0 && (
        <div
          className="border border-[#7a302b] bg-[#25100e] px-4 py-3 text-[11px] text-[#e98a7c]"
          role="alert"
        >
          <ul className="space-y-1">
            {errorMessages.map(message => <li key={message}>{message}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-7 border-t border-[#2c2f2c] pt-5">
        <button
          className="h-12 cursor-pointer border border-b-3 border-[#d4d4d0] bg-[#373837] px-4 text-[11px] font-medium tracking-[0.04em] text-white uppercase shadow-[inset_0_0_0_2px_#171817] transition-colors hover:bg-[#454645] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="h-12 cursor-pointer border border-[#d4d4d0] bg-[#f4f4f2] px-4 text-[11px] font-medium tracking-[0.04em] text-[#111211] uppercase transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-[#777975] disabled:text-[#b8bab6]"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
