import {
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
    <section className="mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-6 py-6 max-[640px]:px-4">
      <header className="flex items-center justify-between border border-[#343734] bg-[#070808] px-5 py-4">
        <Brand/>
      </header>

      <main className="grid flex-1 place-items-center py-12">
        <section className="relative w-full overflow-hidden p-[clamp(28px,5vw,64px)]">
          <div
            className="absolute inset-0 bg-size-[18px_18px]"/>

          <div className="relative">
            <span
              className="block text-[clamp(72px,14vw,168px)] leading-[0.8] font-semibold tracking-[-0.09em] text-[#202320]">
              404
            </span>
            <h1
              className="mt-7 whitespace-nowrap text-[clamp(30px,6vw,76px)] leading-[0.92] font-medium tracking-[-0.07em] text-[#efefea] uppercase">
              Page not found.
            </h1>
            <p className="mt-7 max-w-135 text-xs leading-6 text-[#858984]">
              The requested address does not match an available KeepCare route.
              Return to a known location to continue.
            </p>

            <Link
              className="mt-9 inline-flex items-center gap-4 border border-[#dadbd6] bg-[#dedfda] px-5 py-3 text-[10px] font-semibold tracking-[0.08em] text-[#080908] uppercase hover:bg-white"
              to={destination}
            >
              {isAuthenticated ? 'Return to tasks' : 'Return home'}
              <LuArrowRight aria-hidden="true"/>
            </Link>
          </div>
        </section>
      </main>
    </section>
  );
}
