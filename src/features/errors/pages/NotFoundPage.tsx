import {
  LuArrowLeft,
  LuArrowRight,
} from 'react-icons/lu';
import { Link } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Brand from '@/components/brand/Brand.tsx';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function NotFoundPage() {
  const {isAuthenticated} = useAuth();
  const destination = isAuthenticated ? ROUTES.tasks : ROUTES.home;

  return (
    <div className="min-h-screen bg-[#080909] px-6 max-[640px]:px-4">
      <header className="mx-auto flex h-20 w-full max-w-[1060px] items-center justify-between">
        <Brand/>
        <Link className="inline-flex items-center gap-2 text-xs text-[#8f948e] transition-colors hover:text-white" to={destination}>
          <LuArrowLeft aria-hidden="true"/>
          Back
        </Link>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1060px] place-items-center py-16">
        <section className="w-full max-w-[680px] text-center">
          <span className="inline-flex rounded-full bg-[#191b19] px-4 py-2 text-xs text-[#f0783c]">
            Error 404
          </span>
          <h1 className="mt-7 text-[clamp(48px,8vw,82px)] leading-[0.98] font-medium tracking-[-0.065em] text-[#efefea]">
            This page wandered off.
          </h1>
          <p className="mx-auto mt-7 max-w-[480px] text-sm leading-7 text-[#8f948e]">
            The address may be incorrect, or the page may have moved.
          </p>

          <Link
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#f0783c] px-6 py-3.5 text-sm font-medium text-[#160b06] transition-colors hover:bg-[#ff8a4f]"
            to={destination}
          >
            {isAuthenticated ? 'Back to tasks' : 'Go home'}
            <LuArrowRight aria-hidden="true"/>
          </Link>
        </section>
      </main>
    </div>
  );
}
