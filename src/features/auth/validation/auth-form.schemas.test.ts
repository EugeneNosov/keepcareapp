import { describe, expect, test } from 'vitest';
import {
  loginFormSchema,
  registrationFormSchema,
} from './auth-form.schemas.ts';

function getMessages(result: ReturnType<typeof loginFormSchema.safeParse>) {
  return result.success
    ? []
    : result.error.issues.map(({message}) => message);
}

describe('loginFormSchema', () => {
  test('accepts valid credentials and trims the email address', () => {
    expect(loginFormSchema.parse({
      email: '  alex@example.com  ',
      password: 'correct-password',
    })).toEqual({
      email: 'alex@example.com',
      password: 'correct-password',
    });
  });

  test('requires an email address and password', () => {
    const messages = getMessages(loginFormSchema.safeParse({
      email: '',
      password: '',
    }));

    expect(messages).toContain('Email address is required.');
    expect(messages).toContain('Password is required.');
  });

  test('rejects an invalid email address', () => {
    expect(getMessages(loginFormSchema.safeParse({
      email: 'not-an-email',
      password: 'correct-password',
    }))).toContain('Enter a valid email address.');
  });
});

describe('registrationFormSchema', () => {
  test.each([undefined, ''])(
    'accepts registration without a display name: %s',
    (displayName) => {
      expect(registrationFormSchema.safeParse({
        displayName,
        email: 'alex@example.com',
        password: 'password123',
      }).success).toBe(true);
    },
  );

  test('trims valid registration text values', () => {
    expect(registrationFormSchema.parse({
      displayName: '  Alex  ',
      email: '  alex@example.com  ',
      password: 'password123',
    })).toEqual({
      displayName: 'Alex',
      email: 'alex@example.com',
      password: 'password123',
    });
  });

  test.each([
    ['short', 'Password must contain at least 8 characters.'],
    ['a'.repeat(129), 'Password cannot exceed 128 characters.'],
  ])('rejects an invalid registration password', (password, message) => {
    const result = registrationFormSchema.safeParse({
      email: 'alex@example.com',
      password,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(expect.arrayContaining([
        expect.objectContaining({path: ['password'], message}),
      ]));
    }
  });

  test.each([8, 128])('accepts a password at the %i-character boundary', (length) => {
    expect(registrationFormSchema.safeParse({
      email: 'alex@example.com',
      password: 'a'.repeat(length),
    }).success).toBe(true);
  });

  test('rejects an overlong display name', () => {
    const result = registrationFormSchema.safeParse({
      displayName: 'a'.repeat(121),
      email: 'alex@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(expect.arrayContaining([
        expect.objectContaining({
          path: ['displayName'],
          message: 'Display name cannot exceed 120 characters.',
        }),
      ]));
    }
  });
});
