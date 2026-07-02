import { useCallback, useState } from 'react';
import {
  GoogleLogin,
  type CredentialResponse,
} from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { LuArrowLeft, LuLockKeyhole } from 'react-icons/lu';
import { Link, Navigate, useNavigate } from 'react-router';
import Brand from '../../../components/brand/Brand.tsx';
import { ApiError } from '../../../shared/api';
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
      navigate('/tasks', {replace: true});
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
      navigate('/tasks', {replace: true});
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
        className="grid min-h-[540px] w-full max-w-[900px] grid-cols-[0.9fr_1.1fr] border border-[#525552] bg-[#171817] max-[720px]:grid-cols-1">
        <aside
          className="relative flex flex-col overflow-hidden border-r border-[#3a3c3a] bg-[#151615] p-9 max-[720px]:min-h-[260px] max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:p-7">
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:18px_18px]"/>
          <Brand/>

          <div className="relative my-auto max-[720px]:my-10">
            <p className="mb-3 text-[9px] tracking-[0.13em] text-[#f0783c] uppercase">Authorized access only</p>
            <h1
              className="text-[clamp(34px,5vw,52px)] leading-none font-medium tracking-[-0.05em] text-[#eeeeea] uppercase">
              Welcome<br/>back.
            </h1>
            <p className="mt-6 max-w-[290px] text-[11px] leading-6 text-[#a0a49f]">
              Access your care workspace and review current task operations.
            </p>
          </div>
        </aside>

        <div className="flex flex-col justify-center p-[clamp(36px,6vw,68px)] max-[720px]:p-7">
          <div className="flex items-center gap-4 border-b border-[#3a3c3a] pb-6">
            <span className="grid size-9 place-items-center border border-[#656865] text-[#f0783c]">
              <LuLockKeyhole aria-hidden="true"/>
            </span>
            <div>
              <h2 className="text-lg font-medium tracking-[0.04em] text-[#e8e9e3] uppercase">Sign in</h2>
            </div>
          </div>

          <form className="mt-7 grid gap-5" onSubmit={handleSubmit(handleLogin)}>
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
            </label>

            {requestError && (
              <p className="m-0 border border-[#7c3932] bg-[#25100e] px-3 py-2.5 text-[10px] leading-5 text-[#e98a7e]"
                 role="alert">
                {requestError}
              </p>
            )}

            <button
              className="flex h-12 cursor-pointer items-center justify-between border border-[#d8d9d4] bg-[#dedfda] px-4 text-[10px] font-semibold tracking-[0.09em] text-[#090a09] uppercase hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || isGoogleSubmitting}
              type="submit">
              {isSubmitting ? 'Signing in...' : 'Login'} <span aria-hidden="true">→</span>
            </button>

            <div className="flex items-center gap-3 text-[9px] tracking-[0.1em] text-[#929691] uppercase">
              <span className="h-px flex-1 bg-[#3a3c3a]"/>
              <span>Or continue with</span>
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

            <p className="m-0 text-center text-[9px] tracking-[0.06em] text-[#929691] uppercase">
              New to KeepCare?{' '}
              <Link className="text-[#e8e9e3] underline-offset-4 hover:text-[#f0783c] hover:underline" to="/register">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
