import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuArrowRight } from 'react-icons/lu';
import { Link, Navigate, useNavigate } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Button from '@/components/Button/Button.tsx';
import Input from '@/components/Input/Input.tsx';
import { ApiError } from '@/shared/api';
import AuthPageLayout from '../components/AuthPageLayout.tsx';
import { useAuth } from '../hooks/useAuth';
import type { RegisterInput } from '../types/auth.types';

export function RegisterPage() {
  const navigate = useNavigate();
  const {isAuthenticated, isLoading, register} = useAuth();
  const [requestError, setRequestError] = useState<string | null>(null);
  const {
    register: registerField,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<RegisterInput>();

  async function handleRegistration(input: RegisterInput) {
    setRequestError(null);

    try {
      await register({
        ...input,
        displayName: input.displayName?.trim() || undefined,
      });
      navigate(ROUTES.tasks, {replace: true});
    } catch (error) {
      setRequestError(
        error instanceof ApiError
          ? error.message
          : 'Unable to create your account. Please try again.',
      );
    }
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-[10px] tracking-[0.1em] text-[#a2a5a1] uppercase"
           role="status">
        Restoring session...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.tasks} replace/>;
  }

  return (
    <AuthPageLayout
      cardSubtitle="New to KeepCare?"
      cardTitle="Create account"
      description="Create a calm, reliable home for the recurring tasks in your life."
      eyebrow="Start simply"
      note="Add your first task in a minute"
      title="Make room for what matters."
    >
      <form className="mt-7 grid gap-5" onSubmit={handleSubmit(handleRegistration)}>
        <div className="grid gap-2.5">
          <Input
            label="Display name"
            id="register-display-name"
            placeholder="Your name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.displayName)}
            {...registerField('displayName', {
              maxLength: {
                value: 120,
                message: 'Display name cannot exceed 120 characters.',
              },
            })}
          />
          {errors.displayName && (
            <span className="normal-case text-[#e36f5e]" role="alert">
                  {errors.displayName.message}
                </span>
          )}
        </div>

        <div className="grid gap-2.5">
          <Input
            label="Email address"
            id="register-email"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...registerField('email', {
              required: 'Email address is required.',
            })}
          />
          {errors.email && (
            <span className="normal-case text-[#e36f5e]" role="alert">
                  {errors.email.message}
                </span>
          )}
        </div>

        <div className="grid gap-2.5">
          <Input
            label="Password"
            id="register-password"
            placeholder="At least 8 characters"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...registerField('password', {
              required: 'Password is required.',
              minLength: {
                value: 8,
                message: 'Password must contain at least 8 characters.',
              },
              maxLength: {
                value: 128,
                message: 'Password cannot exceed 128 characters.',
              },
            })}
          />
          {errors.password && (
            <span className="normal-case text-[#e36f5e]" role="alert">
                  {errors.password.message}
                </span>
          )}
        </div>

        {requestError && (
          <p className="m-0 rounded-xl border border-[#63342f] bg-[#25100e] px-4 py-3 text-xs leading-5 text-[#e98a7e]"
             role="alert">
            {requestError}
          </p>
        )}

        <Button
          disabled={isSubmitting}
          icon={LuArrowRight}
          iconPosition="right"
          label={isSubmitting ? 'Creating account...' : 'Create account'}
          type="submit"
        />

        <p className="m-0 text-center text-xs text-[#858a84]">
          Already registered?{' '}
          <Link className="text-[#e8e9e3] transition-colors hover:text-[#f0783c]" to={ROUTES.login}>
            Sign in
          </Link>
        </p>
      </form>
    </AuthPageLayout>
  );
}
