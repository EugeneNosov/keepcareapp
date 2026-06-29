import { LuArrowLeft, LuHeartPulse, LuLockKeyhole } from 'react-icons/lu'
import { Link } from 'react-router'

export function LoginPage() {
  return (
    <div
      className="grid min-h-screen place-items-center px-6 pt-[72px] pb-10 max-[720px]:block max-[720px]:px-4 max-[720px]:pt-[78px] max-[720px]:pb-6">
      <Link
        className="absolute top-7 left-8 inline-flex items-center gap-[9px] text-[11px] tracking-[0.05em] text-[#84857e] no-underline uppercase hover:text-[#ffd43b] max-[720px]:top-6 max-[720px]:left-[18px]"
        to="/"
      >
        <LuArrowLeft aria-hidden="true"/>
        Back to home
      </Link>

      <section
        className="grid min-h-[570px] w-full max-w-[920px] grid-cols-[minmax(280px,0.85fr)_minmax(360px,1.15fr)] border border-[#30312b] bg-[rgba(8,9,8,0.92)] shadow-[0_28px_80px_rgba(0,0,0,0.35)] max-[720px]:grid-cols-1">
        <aside
          className="flex flex-col border-r border-[#30312b] bg-[linear-gradient(145deg,rgba(255,212,59,0.08),transparent_48%),#0b0c0a] p-[38px] max-[720px]:min-h-[280px] max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:p-7">
          <div className="flex items-center gap-3 text-[13px] font-semibold tracking-[0.1em] text-[#f5f5f0] uppercase">
            <span className="grid size-9 place-items-center border border-[#ffd43b] text-[#ffd43b]">
              <LuHeartPulse aria-hidden="true"/>
            </span>
            KeepCare
          </div>

          <div className="my-auto max-[720px]:my-[42px]">
            <h1
              className="m-0 text-[clamp(42px,6vw,64px)] leading-[0.95] font-medium tracking-[-0.07em] text-[#f3f3ee]">
              Welcome<br/>back.
            </h1>
            <p className="mt-[26px] max-w-[300px] text-xs leading-[1.8] text-[#8e8f87]">
              Sign in to review your tasks and keep the important things moving.
            </p>
          </div>
        </aside>

        <div className="flex flex-col justify-center p-[clamp(38px,6vw,70px)] max-[720px]:px-7 max-[720px]:py-8">
          <div className="flex items-center gap-4 border-b border-[#292a25] pb-7">
            <span className="grid size-9 place-items-center border border-[#ffd43b] text-[#ffd43b]">
              <LuLockKeyhole aria-hidden="true"/>
            </span>
            <div>
              <h2 className="m-0 text-2xl font-medium text-[#f3f3ee]">
                Sign in
              </h2>
            </div>
          </div>

          <div className="mt-[30px] grid gap-[22px]">
            <label className="grid gap-2.5 text-[11px] tracking-[0.04em] text-[#b6b7b0]">
              Email address
              <input
                className="h-[50px] w-full rounded-none border border-[#363730] bg-[#080908] px-[15px] text-xs text-[#f0f0eb] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#55564f] focus:border-[#ffd43b] focus:shadow-[0_0_0_2px_rgba(255,212,59,0.08)]"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="grid gap-2.5 text-[11px] tracking-[0.04em] text-[#b6b7b0]">
              Password
              <input
                className="h-[50px] w-full rounded-none border border-[#363730] bg-[#080908] px-[15px] text-xs text-[#f0f0eb] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#55564f] focus:border-[#ffd43b] focus:shadow-[0_0_0_2px_rgba(255,212,59,0.08)]"
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </label>

            <button
              className="flex h-[50px] cursor-pointer items-center justify-between border border-[#ffd43b] bg-[#ffd43b] px-[17px] font-semibold text-[#090a08] hover:bg-[#ffe06c]"
              type="button"
            >
              Login
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
