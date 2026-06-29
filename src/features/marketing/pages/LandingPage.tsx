import { LuActivity, LuArrowRight, LuHeartPulse, LuShieldCheck } from 'react-icons/lu'
import { Link } from 'react-router'

export function LandingPage() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-6 py-6 max-[640px]:px-4">
      <header className="flex items-center justify-between border border-[#343734] bg-[#070808] px-5 py-4">
        <div className="flex items-center gap-3 text-xs tracking-[0.11em] text-[#ecece7] uppercase">
          <span className="grid size-8 place-items-center border border-[#626662]">
            <LuHeartPulse className="size-4" aria-hidden="true"/>
          </span>
          KeepCare control interface
        </div>
        <span className="hidden text-[9px] tracking-[0.1em] text-[#797d78] uppercase sm:block">
          System status: <strong className="bg-[#173422] px-1.5 py-0.5 font-medium text-[#68d792]">Online</strong>
        </span>
      </header>

      <main className="grid flex-1 grid-cols-[1.15fr_0.85fr] items-center gap-8 py-12 max-[800px]:grid-cols-1">
        <div className="border border-[#383b38] bg-[#070808] p-[clamp(28px,5vw,64px)]">
          <p
            className="mb-5 flex items-center gap-2 text-[9px] tracking-[0.14em] text-[#f0783c] uppercase before:h-5 before:w-0.5 before:bg-[#f0783c]">
            Personal care operations
          </p>
          <h1
            className="max-w-[720px] text-[clamp(44px,7vw,88px)] leading-[0.92] font-medium tracking-[-0.07em] text-[#efefea] uppercase">
            Keep life<br/>in check.
          </h1>
          <p className="mt-8 max-w-[560px] text-xs leading-6 text-[#858984]">
            One secure workspace for tasks, reminders, and the care details that should never slip through the cracks.
          </p>
          <nav className="mt-9 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-4 border border-[#dadbd6] bg-[#dedfda] px-5 py-3 text-[10px] font-semibold tracking-[0.08em] text-[#080908] uppercase hover:bg-white"
              to="/login">
              Access workspace <LuArrowRight aria-hidden="true"/>
            </Link>
            <Link
              className="inline-flex items-center gap-4 border border-[#4a4d4a] px-5 py-3 text-[10px] tracking-[0.08em] text-[#c5c7c2] uppercase hover:border-[#f0783c] hover:text-[#f0783c]"
              to="/tasks">
              View tasks
            </Link>
          </nav>
        </div>

        <aside className="grid gap-4">
          {[
            {
              title: 'Task monitoring',
              text: 'Track active, pending, and completed care actions.',
              icon: LuActivity,
              accent: '#f0783c'
            },
            {
              title: 'Private by design',
              text: 'Your personal workspace remains focused and protected.',
              icon: LuShieldCheck,
              accent: '#4bd49b'
            },
          ].map(({title, text, icon: Icon, accent}) => (
            <article className="border border-[#383b38] bg-[#070808] p-6" key={title}>
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[9px] tracking-[0.1em] text-[#777b77] uppercase">System module</p>
                  <h2 className="mt-3 text-sm font-medium tracking-[0.04em] text-[#e2e3de] uppercase">{title}</h2>
                  <p className="mt-3 text-[11px] leading-5 text-[#7d817c]">{text}</p>
                </div>
                <Icon className="size-5 shrink-0" style={{color: accent}} aria-hidden="true"/>
              </div>
              <div className="mt-6 h-1 bg-[#202320]">
                <span className="block h-full w-2/3" style={{backgroundColor: accent}}/>
              </div>
            </article>
          ))}
        </aside>
      </main>
    </section>
  )
}
