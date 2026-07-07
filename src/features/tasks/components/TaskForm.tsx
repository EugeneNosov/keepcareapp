import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '@/components/Button/Button.tsx'
import Input from '@/components/Input/Input.tsx';
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
      <Input label="Task name" id="task-name" placeholder="Enter task name"
             type="text" {...register('name')}/>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_150px]">
        <Input
          label="Repeat every"
          id="task-repeat-value"
          min={1}
          placeholder="2"
          type="number"
          {...register('repeatEvery.value', {valueAsNumber: true})}
        />

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
        <Button
          label="Cancel"
          onClick={handleCancel}
          variant="secondary"
        />
        <Button
          disabled={!isValid || isSubmitting}
          label={isSubmitting ? 'Saving...' : submitLabel}
          type="submit"
        />
      </div>
    </form>
  )
}
