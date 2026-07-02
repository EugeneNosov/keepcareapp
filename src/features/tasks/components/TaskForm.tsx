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
  defaultValues?: TaskFormData;
  requestError?: string | null;
  onCancel: () => void;
  onSubmit: (data: TaskFormData) => void | Promise<void>;
  submitLabel: string;
}

const initialTaskFormData: TaskFormData = {
  name: '',
  repeatEvery: {
    value: 3,
    unit: 'days',
  },
}

const fieldClassName = 'h-12 w-full rounded-xl border border-[#303330] bg-[#191b19] px-4 text-sm text-[#eeeeea] outline-none transition-colors placeholder:text-[#666b66] hover:border-[#454945] focus:border-[#f0783c]'
const labelClassName = 'text-xs text-[#a8aba6]'

export default function TaskForm({
                                   defaultValues = initialTaskFormData,
                                   requestError,
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
          className="rounded-xl border border-[#63342f] bg-[#25100e] px-4 py-3 text-xs text-[#e98a7c]"
          role="alert"
        >
          <ul className="space-y-1">
            {errorMessages.map(message => <li key={message}>{message}</li>)}
          </ul>
        </div>
      )}

      {requestError && (
        <div
          className="rounded-xl border border-[#63342f] bg-[#25100e] px-4 py-3 text-xs text-[#e98a7c]"
          role="alert"
        >
          {requestError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          className="h-12 cursor-pointer rounded-full bg-[#202320] px-4 text-sm text-[#aeb2ac] transition-colors hover:bg-[#292c29] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="h-12 cursor-pointer rounded-full bg-[#f0783c] px-4 text-sm font-medium text-[#160b06] transition-colors hover:bg-[#ff8a4f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0783c] disabled:cursor-not-allowed disabled:bg-[#493126] disabled:text-[#8c6958]"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
