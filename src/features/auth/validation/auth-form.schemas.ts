import { z } from 'zod';

const emailSchema = z.string()
  .trim()
  .min(1, 'Email address is required.')
  .pipe(z.email({error: 'Enter a valid email address.'}));

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string()
    .min(1, 'Password is required.'),
});

export const registrationFormSchema = z.object({
  displayName: z.string()
    .trim()
    .max(120, 'Display name cannot exceed 120 characters.')
    .optional(),
  email: emailSchema,
  password: z.string()
    .min(1, 'Password is required.')
    .min(8, 'Password must contain at least 8 characters.')
    .max(128, 'Password cannot exceed 128 characters.'),
});
