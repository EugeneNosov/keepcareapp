import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuArrowLeft, LuArrowRight, LuCheck } from 'react-icons/lu';
import { Link, Navigate, useNavigate } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Brand from '@/components/Brand/Brand.tsx';
import Button from '@/components/Button/Button.tsx';
import Input from '@/components/Input/Input.tsx';
import { ApiError } from '@/shared/api';
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
    <div className="min-h-screen bg-[#080909] px-6 max-[640px]:px-4">
      <header className="mx-auto flex h-20 w-full max-w-[1060px] items-center justify-between">
        <Brand/>
        <Link className="inline-flex items-center gap-2 text-xs text-[#8f948e] transition-colors hover:text-white" to={ROUTES.home}>
          <LuArrowLeft aria-hidden="true"/> Home
        </Link>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1060px] grid-cols-[0.9fr_1.1fr] items-center gap-24 py-16 max-[850px]:grid-cols-1 max-[850px]:gap-12 max-[850px]:py-10">
        <section>
          <p className="mb-5 text-xs font-medium tracking-[0.08em] text-[#f0783c] uppercase">Start simply</p>
          <h1 className="text-[clamp(42px,6vw,68px)] leading-[1] font-medium tracking-[-0.06em] text-[#eeeeea]">
            Make room for what matters.
          </h1>
          <p className="mt-6 max-w-[430px] text-sm leading-7 text-[#8f948e]">
            Create a calm, reliable home for the recurring tasks in your life.
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs text-[#737873]">
            <LuCheck className="text-[#65c99b]" aria-hidden="true"/>
            Add your first task in a minute
          </div>
        </section>

        <section className="rounded-3xl border border-[#292c29] bg-[#111311] p-[clamp(24px,5vw,52px)] shadow-2xl shadow-black/30">
          <div>
            <p className="text-xs text-[#777c76]">New to KeepCare?</p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#e8e9e3]">Create account</h2>
          </div>

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
        </section>
      </main>
    </div>
  );
}
