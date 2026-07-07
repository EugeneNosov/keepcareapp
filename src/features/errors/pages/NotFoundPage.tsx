import {
  LuArrowLeft,
  LuArrowRight,
} from 'react-icons/lu';
import { Link, useNavigate } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Brand from '@/components/Brand/Brand.tsx';
import Button from '@/components/Button/Button.tsx';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function NotFoundPage() {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();
  const destination = isAuthenticated ? ROUTES.tasks : ROUTES.home;

  function handleNavigate() {
    navigate(destination);
  }

  return (
    <div className="min-h-screen bg-[#080909] px-6 max-[640px]:px-4">
      <header className="mx-auto flex h-20 w-full max-w-[1060px] items-center justify-between">
        <Brand/>
        <Link className="inline-flex items-center gap-2 text-xs text-[#8f948e] transition-colors hover:text-white" to={destination}>
          <LuArrowLeft aria-hidden="true"/>
          Back
        </Link>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-265 place-items-center py-16">
        <section className="w-full max-w-170 text-center">
          <span className="inline-flex rounded-full bg-[#191b19] px-4 py-2 text-xs text-[#f0783c]">
            Error 404
          </span>
          <h1 className="mt-7 text-[clamp(48px,8vw,82px)] leading-[0.98] font-medium tracking-[-0.065em] text-[#efefea]">
            This page wandered off.
          </h1>
          <p className="mx-auto mt-7 max-w-120 text-sm leading-7 text-[#8f948e] pb-10">
            The address may be incorrect, or the page may have moved.
          </p>

          <Button
            icon={LuArrowRight}
            iconPosition="right"
            label={isAuthenticated ? 'Back to tasks' : 'Go home'}
            onClick={handleNavigate}
          />
        </section>
      </main>
    </div>
  );
}
