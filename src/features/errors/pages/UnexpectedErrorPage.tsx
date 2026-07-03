import {
  LuRefreshCw,
} from 'react-icons/lu';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import Brand from '@/components/brand/Brand.tsx';

export function UnexpectedErrorPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <div className="min-h-screen bg-[#080909] px-6 max-[640px]:px-4">
      <header className="mx-auto flex h-20 w-full max-w-[1060px] items-center justify-between">
        <Brand/>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1060px] place-items-center py-16">
        <section className="w-full max-w-[680px] text-center">
          <span className="inline-flex rounded-full bg-[#191b19] px-4 py-2 text-xs text-[#f0783c]">
            Error {status}
          </span>
          <h1
            className="mt-7 text-[clamp(48px,8vw,82px)] leading-[0.98] font-medium tracking-[-0.065em] text-[#efefea]">
            Something went wrong.
          </h1>
          <p className="mx-auto mt-7 max-w-[480px] text-sm leading-7 text-[#8f948e]">
            KeepCare could not finish loading this page. Please try again.
          </p>

          <button
            className="mt-9 inline-flex cursor-pointer items-center gap-3 rounded-full bg-[#f0783c] px-6 py-3.5 text-sm font-medium text-[#160b06] transition-colors hover:bg-[#ff8a4f]"
            onClick={() => window.location.reload()}
            type="button"
          >
            Try again
            <LuRefreshCw aria-hidden="true"/>
          </button>
        </section>
      </main>
    </div>
  );
}
