import { z } from 'zod';
import { TASK_REPEAT_UNITS } from '../task.constants.ts';

function isValidCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsedDate = new Date(0);

  parsedDate.setUTCHours(0, 0, 0, 0);
  parsedDate.setUTCFullYear(year, month - 1, day);

  return parsedDate.getUTCFullYear() === year
    && parsedDate.getUTCMonth() === month - 1
    && parsedDate.getUTCDate() === day;
}

export const taskFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Task name is required')
    .max(50, 'Task name must be 50 characters or less'),
  startsAt: z.string()
    .min(1, 'Start date is required')
    .refine(
      (value) => value.length === 0 || isValidCalendarDate(value),
      'Start date is invalid',
    ),
  repeatEvery: z.object({
    value: z.number()
      .int('Period must be a whole number')
      .min(1, 'Period must be at least 1'),
    unit: z.enum(TASK_REPEAT_UNITS),
  }),
  notes: z.string()
    .max(240, 'Notes must be 240 characters or less')
    .optional(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
