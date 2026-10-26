import { describe, expect, test } from 'vitest';
import {
  COMPLETION_NOTE_MAX_LENGTH,
  completeTaskFormSchema,
} from './complete-task-form.schema.ts';

describe('completeTaskFormSchema', () => {
  test.each(['', '   '])('accepts an empty optional note: %j', (note) => {
    expect(completeTaskFormSchema.parse({note})).toEqual({note: ''});
  });

  test('trims a valid completion note', () => {
    expect(completeTaskFormSchema.parse({
      note: '  Replaced the filter.  ',
    })).toEqual({note: 'Replaced the filter.'});
  });

  test('accepts a note at the maximum length', () => {
    expect(completeTaskFormSchema.safeParse({
      note: 'a'.repeat(COMPLETION_NOTE_MAX_LENGTH),
    }).success).toBe(true);
  });

  test('rejects a note over the maximum length', () => {
    const result = completeTaskFormSchema.safeParse({
      note: 'a'.repeat(COMPLETION_NOTE_MAX_LENGTH + 1),
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ['note'],
        message: `Completion note must be ${COMPLETION_NOTE_MAX_LENGTH} characters or less`,
      });
    }
  });
});
