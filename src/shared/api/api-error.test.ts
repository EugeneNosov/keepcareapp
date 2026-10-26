import { describe, expect, test } from 'vitest';
import { ApiError } from './api-error.ts';

describe('ApiError.fromResponse', () => {
  test('uses the first validation message and preserves every detail', () => {
    const error = ApiError.fromResponse(422, {
      message: ['Task name is required.', 'Start date is invalid.'],
      error: 'Unprocessable Entity',
    });

    expect(error).toBeInstanceOf(ApiError);
    expect(error.name).toBe('ApiError');
    expect(error.status).toBe(422);
    expect(error.message).toBe('Task name is required.');
    expect(error.details).toEqual([
      'Task name is required.',
      'Start date is invalid.',
    ]);
  });

  test('converts a single message into error details', () => {
    const error = ApiError.fromResponse(400, {
      message: 'The submitted task is invalid.',
    });

    expect(error.message).toBe('The submitted task is invalid.');
    expect(error.details).toEqual(['The submitted task is invalid.']);
  });

  test('uses the HTTP error label when no message is provided', () => {
    const error = ApiError.fromResponse(409, {error: 'Conflict'});

    expect(error.message).toBe('Conflict');
    expect(error.details).toEqual([]);
  });

  test.each([
    null,
    'Bad Gateway',
    42,
    [],
    {},
    {message: ''},
    {message: 42},
    {message: ['Valid detail', 42]},
    {error: false},
  ])(
    'uses a safe fallback for an unusable payload: %j',
    (payload) => {
      const error = ApiError.fromResponse(500, payload);

      expect(error.message).toBe('Something went wrong. Please try again.');
      expect(error.details).toEqual([]);
    },
  );
});
