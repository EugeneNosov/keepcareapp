import { useCallback, useState } from 'react';
import {
  GoogleLogin,
  type CredentialResponse,
} from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { LuArrowRight } from 'react-icons/lu';
import { Link, Navigate, useNavigate } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Button from '@/components/Button/Button.tsx';
import Input from '@/components/Input/Input.tsx';
import { ApiError } from '@/shared/api';
import AuthPageLayout from '../components/AuthPageLayout.tsx';
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
    <AuthPageLayout
      cardSubtitle="KeepCare account"
      cardTitle="Sign in"
      description="Sign in to see what needs attention and what can safely wait."
      eyebrow="Welcome back"
      note="Your recurring schedule stays in sync"
      title="Your care list is waiting."
    >
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

        <Button
          disabled={isSubmitting || isGoogleSubmitting}
          icon={LuArrowRight}
          iconPosition="right"
          label={isSubmitting ? 'Signing in...' : 'Sign in'}
          type="submit"
        />

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
    </AuthPageLayout>
  );
}
