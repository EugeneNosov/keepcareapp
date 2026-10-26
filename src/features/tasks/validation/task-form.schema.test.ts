import { describe, expect, test } from 'vitest';
import { taskFormSchema } from './task-form.schema.ts';

const validTaskFormData = {
  name: 'Replace water filter',
  startsAt: '2026-11-05',
  repeatEvery: {
    value: 3,
    unit: 'months',
  },
  notes: 'Use the spare filter from the utility closet.',
} as const;

function expectValidationIssue(
  input: unknown,
  path: PropertyKey[],
  message?: string,
) {
  const result = taskFormSchema.safeParse(input);

  expect(result.success).toBe(false);

  if (result.success) {
    return;
  }

  expect(result.error.issues).toEqual(expect.arrayContaining([
    expect.objectContaining({
      path,
      ...(message ? {message} : {}),
    }),
  ]));
}

describe('taskFormSchema', () => {
  test('accepts and normalizes valid create-task data', () => {
    expect(taskFormSchema.parse({
      ...validTaskFormData,
      name: '  Replace water filter  ',
      notes: undefined,
    })).toEqual({
      ...validTaskFormData,
      name: 'Replace water filter',
      notes: undefined,
    });
  });

  test('accepts valid edit-task data with optional notes', () => {
    expect(taskFormSchema.safeParse(validTaskFormData).success).toBe(true);
  });

  test.each([
    ['name', {startsAt: validTaskFormData.startsAt, repeatEvery: validTaskFormData.repeatEvery}],
    ['startsAt', {name: validTaskFormData.name, repeatEvery: validTaskFormData.repeatEvery}],
    ['repeatEvery', {name: validTaskFormData.name, startsAt: validTaskFormData.startsAt}],
  ])('rejects a missing required %s field', (field, input) => {
    expectValidationIssue(input, [field]);
  });

  test('rejects a blank task name', () => {
    expectValidationIssue(
      {...validTaskFormData, name: '   '},
      ['name'],
      'Task name is required',
    );
  });

  test('enforces the task-name boundary', () => {
    expect(taskFormSchema.safeParse({
      ...validTaskFormData,
      name: 'a'.repeat(50),
    }).success).toBe(true);
    expectValidationIssue(
      {...validTaskFormData, name: 'a'.repeat(51)},
      ['name'],
      'Task name must be 50 characters or less',
    );
  });

  test.each([
    ['', 'Start date is required'],
    ['05-11-2026', 'Start date is invalid'],
    ['2026/11/05', 'Start date is invalid'],
    ['2026-02-29', 'Start date is invalid'],
    ['2026-04-31', 'Start date is invalid'],
    ['2026-13-01', 'Start date is invalid'],
  ])('rejects invalid start date %j', (startsAt, message) => {
    expectValidationIssue(
      {...validTaskFormData, startsAt},
      ['startsAt'],
      message,
    );
  });

  test('accepts a valid leap-day date', () => {
    expect(taskFormSchema.safeParse({
      ...validTaskFormData,
      startsAt: '2028-02-29',
    }).success).toBe(true);
  });

  test.each([
    [0, 'Period must be at least 1'],
    [-2, 'Period must be at least 1'],
    [1.5, 'Period must be a whole number'],
  ])('rejects invalid repeat value %s', (value, message) => {
    expectValidationIssue(
      {
        ...validTaskFormData,
        repeatEvery: {...validTaskFormData.repeatEvery, value},
      },
      ['repeatEvery', 'value'],
      message,
    );
  });

  test('rejects an unsupported repeat unit', () => {
    expectValidationIssue(
      {
        ...validTaskFormData,
        repeatEvery: {value: 1, unit: 'years'},
      },
      ['repeatEvery', 'unit'],
    );
  });

  test.each([undefined, ''])('accepts optional notes: %s', (notes) => {
    expect(taskFormSchema.safeParse({
      ...validTaskFormData,
      notes,
    }).success).toBe(true);
  });

  test('enforces the notes boundary', () => {
    expect(taskFormSchema.safeParse({
      ...validTaskFormData,
      notes: 'a'.repeat(240),
    }).success).toBe(true);
    expectValidationIssue(
      {...validTaskFormData, notes: 'a'.repeat(241)},
      ['notes'],
      'Notes must be 240 characters or less',
    );
  });
});
