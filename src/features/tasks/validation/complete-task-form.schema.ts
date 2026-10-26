import { z } from 'zod';

export const COMPLETION_NOTE_MAX_LENGTH = 240;

export const completeTaskFormSchema = z.object({
  note: z.string()
    .trim()
    .max(
      COMPLETION_NOTE_MAX_LENGTH,
      `Completion note must be ${COMPLETION_NOTE_MAX_LENGTH} characters or less`,
    ),
});

export type CompleteTaskFormData = z.infer<typeof completeTaskFormSchema>;
