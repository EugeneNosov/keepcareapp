import { afterEach, describe, expect, test, vi } from 'vitest';
import getEnvVariable from './getEnvVariable.ts';

describe('getEnvVariable', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('returns a configured environment variable', () => {
    vi.stubEnv('VITE_TEST_API_URL', 'https://api.example.test');

    expect(getEnvVariable('VITE_TEST_API_URL')).toBe('https://api.example.test');
  });

  test.each([undefined, ''])(
    'throws when the environment variable is missing or empty',
    (value) => {
      vi.stubEnv('VITE_TEST_API_URL', value);

      expect(() => getEnvVariable('VITE_TEST_API_URL')).toThrow(
        'VITE_TEST_API_URL is not configured',
      );
    },
  );
});
