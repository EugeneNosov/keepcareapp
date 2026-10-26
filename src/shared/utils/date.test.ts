import { describe, expect, test } from 'vitest';
import { formatAppDate } from './date.ts';

describe('formatAppDate', () => {
  test('formats a valid date for display', () => {
    expect(formatAppDate('2026-03-05')).toBe('Mar 05, 2026');
  });

  test.each([null, ''])(
    'returns null for an empty value: %s',
    (value) => {
      expect(formatAppDate(value)).toBeNull();
    },
  );

  test('returns null for an invalid date', () => {
    expect(formatAppDate('not-a-date')).toBeNull();
  });

  test.each([
    ['2026-01-01T00:30:00+14:00', 'Dec 31, 2025'],
    ['2026-01-01T23:30:00-12:00', 'Jan 02, 2026'],
  ])('respects timezone boundaries for %s', (value, expectedDate) => {
    expect(formatAppDate(value)).toBe(expectedDate);
  });
});
