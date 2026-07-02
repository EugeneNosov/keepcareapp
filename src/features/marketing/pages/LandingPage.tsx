import {
  LuArrowRight,
  LuCalendarClock,
  LuCheck,
  LuCircleCheck,
  LuClock3,
  LuListTodo,
  LuPlus,
  LuRefreshCw,
  LuShieldCheck,
  LuTriangleAlert,
} from 'react-icons/lu';
import { Link } from 'react-router';
import { ROUTES } from '@/app.constants.ts';
import Brand from '@/components/brand/Brand.tsx';

const exampleTasks = [
  {
    name: 'Replace water filter',
    repeat: 'Every 3 months',
    status: 'Due soon',
    color: '#f0a43c',
    icon: LuClock3,
  },
  {
    name: 'Refill medication',
    repeat: 'Every 4 weeks',
    status: 'Overdue',
    color: '#e36f5e',
    icon: LuTriangleAlert,
  },
  {
    name: 'Check smoke alarms',
    repeat: 'Every 6 months',
    status: 'OK',
    color: '#4bd49b',
    icon: LuCircleCheck,
  },
];

const workflow = [
  {
    step: '01',
    title: 'Create a recurring task',
    text: 'Name what needs attention and choose a repeat period in days, weeks, or months.',
    icon: LuPlus,
  },
  {
    step: '02',
    title: 'See what needs action',
    text: 'KeepCare separates overdue, due-soon, and healthy tasks so priorities stay obvious.',
    icon: LuCalendarClock,
  },
  {
    step: '03',
    title: 'Complete and continue',
    text: 'Mark a task complete and its next due date is calculated from the recurring schedule.',
    icon: LuRefreshCw,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-[1320px] px-6 py-6 max-[640px]:px-4">
      <header className="flex items-center justify-between border border-[#343734] bg-[#070808] px-5 py-4">
        <Brand/>
        <nav className="flex items-center gap-2" aria-label="Account">
          <Link
            className="px-3 py-2 text-[9px] tracking-[0.08em] text-[#a5a8a3] uppercase hover:text-[#f0783c]"
            to={ROUTES.login}
          >
            Sign in
          </Link>
          <Link
            className="border border-[#4a4d4a] px-3 py-2 text-[9px] tracking-[0.08em] text-[#e1e2dc] uppercase hover:border-[#f0783c] hover:text-[#f0783c]"
            to={ROUTES.register}
          >
            Create account
          </Link>
        </nav>
      </header>

      <main>
        <section className="grid grid-cols-[1.08fr_0.92fr] items-stretch gap-6 py-10 max-[900px]:grid-cols-1">
          <div className="relative overflow-hidden border border-[#383b38] bg-[#070808] p-[clamp(30px,5vw,66px)]">
            <div
              className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:18px_18px]"/>
            <div className="relative">
              <p
                className="mb-6 flex items-center gap-2 text-[9px] tracking-[0.14em] text-[#f0783c] uppercase before:h-5 before:w-0.5 before:bg-[#f0783c]">
                Recurring care task tracker
              </p>
              <h1
                className="max-w-[760px] text-[clamp(46px,7vw,92px)] leading-[0.9] font-medium tracking-[-0.075em] text-[#efefea] uppercase">
                Remember<br/>what matters.
              </h1>
              <p className="mt-8 max-w-[610px] text-xs leading-6 text-[#969a95]">
                KeepCare gives recurring household and personal care tasks one
                clear home. See what is overdue, what is coming up, and what can
                safely wait.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-4 border border-[#dadbd6] bg-[#dedfda] px-5 py-3 text-[10px] font-semibold tracking-[0.08em] text-[#080908] uppercase hover:bg-white"
                  to={ROUTES.register}
                >
                  Start tracking
                  <LuArrowRight aria-hidden="true"/>
                </Link>
                <Link
                  className="inline-flex items-center gap-3 border border-[#4a4d4a] px-5 py-3 text-[10px] tracking-[0.08em] text-[#c5c7c2] uppercase hover:border-[#f0783c] hover:text-[#f0783c]"
                  to={ROUTES.login}
                >
                  Open workspace
                </Link>
              </div>

              <div
                className="mt-12 grid grid-cols-3 border-t border-[#292c29] pt-5 max-[560px]:grid-cols-1 max-[560px]:gap-4">
                {[
                  'Days, weeks, months',
                  'Clear due status',
                  'Private account',
                ].map((item) => (
                  <span
                    className="flex items-center gap-2 text-[8px] tracking-[0.07em] text-[#747873] uppercase"
                    key={item}
                  >
                    <LuCheck className="size-3 text-[#4bd49b]" aria-hidden="true"/>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col border border-[#383b38] bg-[#0a0b0a]">
            <header className="flex items-center justify-between border-b border-[#343734] px-5 py-4">
              <div>
                <p className="text-[8px] tracking-[0.12em] text-[#727671] uppercase">
                  Example workspace
                </p>
                <h2 className="mt-2 text-xs font-medium tracking-[0.06em] text-[#e1e2dd] uppercase">
                  Care schedule
                </h2>
              </div>
              <LuListTodo className="size-5 text-[#f0783c]" aria-hidden="true"/>
            </header>

            <div className="grid flex-1 content-center gap-3 p-5">
              {exampleTasks.map(({name, repeat, status, color, icon: Icon}) => (
                <article
                  className="border border-[#343734] bg-[#111312] p-4 transition-colors hover:border-[#555855] hover:bg-[#151715]"
                  key={name}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[11px] font-medium text-[#dcddd7]">
                        {name}
                      </h3>
                      <p className="mt-2 text-[9px] text-[#777b76]">{repeat}</p>
                    </div>
                    <span
                      className="flex shrink-0 items-center gap-2 border px-2.5 py-1.5 text-[8px] tracking-[0.06em] uppercase"
                      style={{borderColor: `${color}55`, color}}
                    >
                      <Icon className="size-3" aria-hidden="true"/>
                      {status}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <footer className="grid grid-cols-3 border-t border-[#343734]">
              {[
                ['01', 'Overdue', '#e36f5e'],
                ['01', 'Due soon', '#f0a43c'],
                ['01', 'OK', '#4bd49b'],
              ].map(([value, label, color]) => (
                <div className="border-r border-[#343734] p-4 last:border-r-0" key={label}>
                  <strong className="text-lg font-medium" style={{color}}>
                    {value}
                  </strong>
                  <span className="mt-1 block text-[8px] tracking-[0.08em] text-[#727671] uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </footer>
          </aside>
        </section>

        <section className="border border-[#383b38] bg-[#070808]">
          <header
            className="flex flex-wrap items-end justify-between gap-5 border-b border-[#343734] px-[clamp(24px,4vw,48px)] py-7">
            <div>
              <p className="text-[9px] tracking-[0.13em] text-[#f0783c] uppercase">
                Simple operating loop
              </p>
              <h2
                className="mt-3 text-[clamp(24px,4vw,40px)] leading-none font-medium tracking-[-0.045em] text-[#e8e9e3] uppercase">
                Add it. Track it. Repeat.
              </h2>
            </div>
            <p className="max-w-[420px] text-[10px] leading-5 text-[#7d817c]">
              No complicated project setup—just the recurring responsibilities
              that keep daily life running.
            </p>
          </header>

          <div className="grid grid-cols-3 max-[800px]:grid-cols-1">
            {workflow.map(({step, title, text, icon: Icon}) => (
              <article
                className="border-r border-[#343734] p-[clamp(24px,4vw,42px)] last:border-r-0 max-[800px]:border-r-0 max-[800px]:border-b max-[800px]:last:border-b-0"
                key={step}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] tracking-[0.12em] text-[#666a65] uppercase">
                    Step {step}
                  </span>
                  <span className="grid size-9 place-items-center border border-[#4a4d4a] text-[#f0783c]">
                    <Icon className="size-4" aria-hidden="true"/>
                  </span>
                </div>
                <h3 className="mt-8 text-sm font-medium tracking-[0.03em] text-[#dedfda] uppercase">
                  {title}
                </h3>
                <p className="mt-4 text-[10px] leading-5 text-[#777b76]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="my-10 flex flex-wrap items-center justify-between gap-7 border border-[#5a4439] bg-[#120d0a] px-[clamp(24px,4vw,48px)] py-8">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center border border-[#71503f] text-[#f0783c]">
              <LuShieldCheck className="size-5" aria-hidden="true"/>
            </span>
            <div>
              <p className="text-[9px] tracking-[0.12em] text-[#f0783c] uppercase">
                Ready when you are
              </p>
              <h2 className="mt-2 text-lg font-medium tracking-[-0.03em] text-[#ebece6]">
                Build a care routine you can actually see.
              </h2>
            </div>
          </div>
          <Link
            className="inline-flex items-center gap-4 border border-[#dadbd6] bg-[#dedfda] px-5 py-3 text-[10px] font-semibold tracking-[0.08em] text-[#080908] uppercase hover:bg-white"
            to={ROUTES.register}
          >
            Create your workspace
            <LuArrowRight aria-hidden="true"/>
          </Link>
        </section>
        </main>
      </div>
    </div>
  );
}
