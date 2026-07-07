import {
  LuArrowRight,
  LuCheck,
  LuCircleCheck,
  LuClock3,
  LuTriangleAlert,
} from 'react-icons/lu';
import { Link } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Brand from '@/components/Brand/Brand.tsx';

const exampleTasks = [
  {name: 'Refill medication', repeat: 'Every 4 weeks', status: 'Overdue', color: '#e97861', icon: LuTriangleAlert},
  {name: 'Replace water filter', repeat: 'Every 3 months', status: 'Due soon', color: '#e5a44e', icon: LuClock3},
  {name: 'Check smoke alarms', repeat: 'Every 6 months', status: 'All good', color: '#65c99b', icon: LuCircleCheck},
];

const benefits = [
  ['Add it once', 'Choose how often a task should repeat.'],
  ['See what matters', 'Overdue and upcoming tasks stay at the top.'],
  ['Complete and relax', 'KeepCare schedules the next due date for you.'],
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080909] text-[#e9eae5]">
      <div className="mx-auto w-full max-w-[1180px] px-6 max-[640px]:px-4">
        <header className="flex h-20 items-center justify-between">
          <Brand/>
          <nav className="flex items-center gap-4 max-[440px]:gap-3" aria-label="Account">
            <Link className="whitespace-nowrap text-xs text-[#a4a8a2] transition-colors hover:text-white"
                  to={ROUTES.login}>
              Sign in
            </Link>
            <Link
              className="whitespace-nowrap rounded-full border border-[#454845] px-4 py-2 text-xs transition-colors hover:border-[#777b76] max-[440px]:px-3"
              to={ROUTES.register}>
              Create account
            </Link>
          </nav>
        </header>

        <main>
          <section
            className="grid min-h-[650px] grid-cols-[1.05fr_0.95fr] items-center gap-20 py-20 max-[900px]:grid-cols-1 max-[900px]:gap-14 max-[900px]:py-14">
            <div>
              <p className="mb-6 text-xs font-medium tracking-[0.08em] text-[#f0783c] uppercase">
                Recurring tasks, remembered
              </p>
              <h1 className="max-w-[650px] text-[clamp(48px,7vw,82px)] leading-[0.98] font-medium tracking-[-0.065em]">
                Keep up with the things that matter.
              </h1>
              <p className="mt-7 max-w-[560px] text-base leading-7 text-[#989d97]">
                One calm place for household and personal care tasks. Know what needs attention today—and let the rest
                wait.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link
                  className="inline-flex items-center gap-3 rounded-full bg-[#f0783c] px-6 py-3.5 text-sm font-medium text-[#160b06] transition-colors hover:bg-[#ff8a4f]"
                  to={ROUTES.register}>
                  Start for free
                  <LuArrowRight aria-hidden="true"/>
                </Link>
                <span className="text-xs text-[#737873]">No setup complexity</span>
              </div>
            </div>

            <aside className="rounded-3xl border border-[#292c29] bg-[#111311] p-4 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between px-3 py-3">
                <div>
                  <p className="text-xs font-medium">Today</p>
                  <p className="mt-1 text-[11px] text-[#777c76]">3 recurring tasks</p>
                </div>
                <span className="rounded-full bg-[#1c211e] px-3 py-1.5 text-[10px] text-[#8f958f]">Care list</span>
              </div>
              <div className="mt-2 space-y-2">
                {exampleTasks.map(({name, repeat, status, color, icon: Icon}) => (
                  <article className="flex items-center justify-between gap-4 rounded-2xl bg-[#191b19] p-4" key={name}>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full"
                            style={{backgroundColor: `${color}16`, color}}>
                        <Icon className="size-4" aria-hidden="true"/>
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-sm text-[#dcddd8]">{name}</h2>
                        <p className="mt-1 text-[11px] text-[#737873]">{repeat}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px]" style={{color}}>{status}</span>
                  </article>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 px-3 py-2 text-[11px] text-[#777c76]">
                <LuCheck className="text-[#65c99b]" aria-hidden="true"/>
                Next dates update automatically
              </div>
            </aside>
          </section>

          <section className="border-t border-[#252825] py-16">
            <p className="mb-10 text-xs tracking-[0.08em] text-[#777c76] uppercase">How it works</p>
            <div className="grid grid-cols-3 gap-10 max-[720px]:grid-cols-1 max-[720px]:gap-8">
              {benefits.map(([title, text], index) => (
                <article key={title}>
                  <span className="text-xs text-[#f0783c]">0{index + 1}</span>
                  <h2 className="mt-4 text-base font-medium">{title}</h2>
                  <p className="mt-2 max-w-[300px] text-sm leading-6 text-[#858a84]">{text}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
