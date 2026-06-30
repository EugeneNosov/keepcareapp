import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TASK_REPEAT_UNITS } from '../task.constants.ts'

const taskFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Task name is required')
    .max(50, 'Task name must be less than 50 characters'),
  repeatEvery: z.object({
    value: z.number()
      .int('Period must be a whole number')
      .min(1, 'Period must be at least 1'),
    unit: z.enum(TASK_REPEAT_UNITS),
  }),
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
  repeatEvery: {
    value: 3,
    unit: 'days',
  },
}

const fieldClassName = 'h-10 w-full border border-[#4b4e4b] bg-[#202220] px-3 text-[11px] text-[#eeeeea] outline-none transition-colors placeholder:text-[#858985] hover:border-[#606360] focus:border-[#d36b3b] focus:ring-1 focus:ring-[#d36b3b]'
const labelClassName = 'text-[9px] font-medium tracking-[0.08em] text-[#b0b3af] uppercase'

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

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_150px]">
        <label className="flex flex-col gap-2">
          <span className={labelClassName}>Repeat every</span>
          <input
            className={fieldClassName}
            min={1}
            placeholder="2"
            type="number"
            {...register('repeatEvery.value', {valueAsNumber: true})}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClassName}>Period</span>
          <select className={fieldClassName} {...register('repeatEvery.unit')}>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
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

      <div className="grid grid-cols-2 gap-7 border-t border-[#3a3c3a] pt-5">
        <button
          className="h-12 cursor-pointer border border-b-3 border-[#dededa] bg-[#414341] px-4 text-[11px] font-medium tracking-[0.04em] text-white uppercase shadow-[inset_0_0_0_2px_#242624] transition-colors hover:bg-[#505250] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
