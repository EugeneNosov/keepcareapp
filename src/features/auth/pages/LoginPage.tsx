import { useCallback, useState } from 'react';
import {
  GoogleLogin,
  type CredentialResponse,
} from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { LuArrowLeft, LuArrowRight, LuCheck } from 'react-icons/lu';
import { Link, Navigate, useNavigate } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Brand from '@/components/Brand/Brand.tsx';
import Input from '@/components/Input/Input.tsx';
import { ApiError } from '@/shared/api';
import { useAuth } from '../hooks/useAuth';
import type { LoginInput } from '../types/auth.types';

export function LoginPage() {
  const navigate = useNavigate();
  const {isAuthenticated, isLoading, login, loginWithGoogle} = useAuth();
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LoginInput>();

  async function handleLogin(input: LoginInput) {
    setRequestError(null);

    try {
      await login(input);
      navigate(ROUTES.tasks, {replace: true});
    } catch (error) {
      setRequestError(
        error instanceof ApiError
          ? error.message
          : 'Unable to sign in. Please try again.',
      );
    }
  }

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setRequestError(null);
    setIsGoogleSubmitting(true);

    try {
      await loginWithGoogle({credential});
      navigate(ROUTES.tasks, {replace: true});
    } catch (error) {
      setRequestError(
        error instanceof ApiError
          ? error.message
          : 'Unable to sign in with Google. Please try again.',
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  }, [loginWithGoogle, navigate]);

  const handleGoogleSuccess = useCallback((response: CredentialResponse) => {
    if (!response.credential) {
      setRequestError('Google did not return a valid credential.');
      return;
    }

    void handleGoogleCredential(response.credential);
  }, [handleGoogleCredential]);

  const handleGoogleError = useCallback(() => {
    setRequestError('Unable to sign in with Google. Please try again.');
  }, []);

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
          <p className="mb-5 text-xs font-medium tracking-[0.08em] text-[#f0783c] uppercase">Welcome back</p>
          <h1 className="text-[clamp(42px,6vw,68px)] leading-[1] font-medium tracking-[-0.06em] text-[#eeeeea]">
            Your care list is waiting.
          </h1>
          <p className="mt-6 max-w-[430px] text-sm leading-7 text-[#8f948e]">
            Sign in to see what needs attention and what can safely wait.
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs text-[#737873]">
            <LuCheck className="text-[#65c99b]" aria-hidden="true"/>
            Your recurring schedule stays in sync
          </div>
        </section>

        <section className="rounded-3xl border border-[#292c29] bg-[#111311] p-[clamp(24px,5vw,52px)] shadow-2xl shadow-black/30">
          <div>
            <p className="text-xs text-[#777c76]">KeepCare account</p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#e8e9e3]">Sign in</h2>
          </div>

          <form className="mt-7 grid gap-5" onSubmit={handleSubmit(handleLogin)}>
            <div className="grid gap-2.5">
              <Input
                label="Email address"
                id="login-email"
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
                id="login-password"
                placeholder="Enter your password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                {...registerField('password', {
                  required: 'Password is required.',
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

            <button
              className="flex h-13 cursor-pointer items-center justify-center gap-3 rounded-full bg-[#f0783c] px-5 text-sm font-medium text-[#160b06] transition-colors hover:bg-[#ff8a4f] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || isGoogleSubmitting}
              type="submit">
              {isSubmitting ? 'Signing in...' : 'Sign in'} <LuArrowRight aria-hidden="true"/>
            </button>

            <div className="flex items-center gap-3 text-[10px] text-[#737873]">
              <span className="h-px flex-1 bg-[#3a3c3a]"/>
              <span>or continue with</span>
              <span className="h-px flex-1 bg-[#3a3c3a]"/>
            </div>

            <div
              className={`grid min-h-11 place-items-center overflow-hidden transition-opacity ${
                isGoogleSubmitting || isSubmitting
                  ? 'pointer-events-none opacity-60'
                  : ''
              }`}
            >
              <GoogleLogin
                onError={handleGoogleError}
                onSuccess={handleGoogleSuccess}
                shape="rectangular"
                size="large"
                text="continue_with"
                theme="filled_black"
                width="320"
              />
            </div>

            <p className="m-0 text-center text-xs text-[#858a84]">
              New to KeepCare?{' '}
              <Link className="text-[#e8e9e3] transition-colors hover:text-[#f0783c]" to={ROUTES.register}>
                Create account
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
