import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuArrowLeft, LuUserPlus } from 'react-icons/lu';
import { Link, Navigate, useNavigate } from 'react-router';
import Brand from '../../../components/brand/Brand.tsx';
import { ApiError } from '../../../shared/api';
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
      navigate('/tasks', {replace: true});
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
    return <Navigate to="/tasks" replace/>;
  }

  return (
    <div
      className="grid min-h-screen place-items-center px-6 py-20 max-[720px]:block max-[720px]:px-4 max-[720px]:pt-[76px]">
      <Link
        className="absolute top-7 left-8 inline-flex items-center gap-2 text-[9px] tracking-[0.1em] text-[#a2a5a1] uppercase hover:text-[#f0783c] max-[720px]:left-4"
        to="/"
      >
        <LuArrowLeft aria-hidden="true"/> Return to home
      </Link>

      <section
        className="grid min-h-[620px] w-full max-w-[900px] grid-cols-[0.9fr_1.1fr] border border-[#525552] bg-[#171817] max-[720px]:grid-cols-1">
        <aside
          className="relative flex flex-col overflow-hidden border-r border-[#3a3c3a] bg-[#151615] p-9 max-[720px]:min-h-[260px] max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:p-7">
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:18px_18px]"/>
          <Brand/>

          <div className="relative my-auto max-[720px]:my-10">
            <p className="mb-3 text-[9px] tracking-[0.13em] text-[#f0783c] uppercase">
              New workspace access
            </p>
            <h1
              className="text-[clamp(34px,5vw,52px)] leading-none font-medium tracking-[-0.05em] text-[#eeeeea] uppercase">
              Start<br/>caring.
            </h1>
            <p className="mt-6 max-w-[290px] text-[11px] leading-6 text-[#a0a49f]">
              Create your KeepCare account and keep recurring care tasks under control.
            </p>
          </div>
        </aside>

        <div className="flex flex-col justify-center p-[clamp(36px,6vw,68px)] max-[720px]:p-7">
          <div className="flex items-center gap-4 border-b border-[#3a3c3a] pb-6">
            <span className="grid size-9 place-items-center border border-[#656865] text-[#f0783c]">
              <LuUserPlus aria-hidden="true"/>
            </span>
            <div>
              <h2 className="text-lg font-medium tracking-[0.04em] text-[#e8e9e3] uppercase">
                Create account
              </h2>
            </div>
          </div>

          <form className="mt-7 grid gap-5" onSubmit={handleSubmit(handleRegistration)}>
            <label className="grid gap-2.5 text-[9px] tracking-[0.08em] text-[#a8aba6] uppercase">
              Display name <span className="text-[#747873]">(optional)</span>
              <input
                className="h-12 w-full rounded-none border border-[#4b4e4b] bg-[#202220] px-3.5 text-[11px] tracking-normal text-[#eeeeea] normal-case outline-none transition-colors placeholder:text-[#858985] hover:border-[#606360] focus:border-[#f0783c] focus:shadow-[inset_2px_0_0_#f0783c]"
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
            </label>

            <label className="grid gap-2.5 text-[9px] tracking-[0.08em] text-[#a8aba6] uppercase">
              Email address
              <input
                className="h-12 w-full rounded-none border border-[#4b4e4b] bg-[#202220] px-3.5 text-[11px] tracking-normal text-[#eeeeea] normal-case outline-none transition-colors placeholder:text-[#858985] hover:border-[#606360] focus:border-[#f0783c] focus:shadow-[inset_2px_0_0_#f0783c]"
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
            </label>

            <label className="grid gap-2.5 text-[9px] tracking-[0.08em] text-[#a8aba6] uppercase">
              Password
              <input
                className="h-12 w-full rounded-none border border-[#4b4e4b] bg-[#202220] px-3.5 text-[11px] tracking-normal text-[#eeeeea] normal-case outline-none transition-colors placeholder:text-[#858985] hover:border-[#606360] focus:border-[#f0783c] focus:shadow-[inset_2px_0_0_#f0783c]"
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
            </label>

            {requestError && (
              <p className="m-0 border border-[#7c3932] bg-[#25100e] px-3 py-2.5 text-[10px] leading-5 text-[#e98a7e]"
                 role="alert">
                {requestError}
              </p>
            )}

            <button
              className="flex h-12 cursor-pointer items-center justify-between border border-[#d8d9d4] bg-[#dedfda] px-4 text-[10px] font-semibold tracking-[0.09em] text-[#090a09] uppercase hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
              <span aria-hidden="true">→</span>
            </button>

            <p className="m-0 text-center text-[9px] tracking-[0.06em] text-[#929691] uppercase">
              Already registered?{' '}
              <Link className="text-[#e8e9e3] underline-offset-4 hover:text-[#f0783c] hover:underline" to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
