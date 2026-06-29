import { LuArrowLeft, LuHeartPulse, LuLockKeyhole } from 'react-icons/lu'
import { Link } from 'react-router'

export function LoginPage() {
  return (
    <div
      className="grid min-h-screen place-items-center px-6 py-20 max-[720px]:block max-[720px]:px-4 max-[720px]:pt-[76px]">
      <Link
        className="absolute top-7 left-8 inline-flex items-center gap-2 text-[9px] tracking-[0.1em] text-[#7f837f] uppercase hover:text-[#f0783c] max-[720px]:left-4"
        to="/"
      >
        <LuArrowLeft aria-hidden="true"/> Return to home
      </Link>

      <section
        className="grid min-h-[540px] w-full max-w-[900px] grid-cols-[0.9fr_1.1fr] border border-[#3a3d3a] bg-[#070808] max-[720px]:grid-cols-1">
        <aside
          className="relative flex flex-col overflow-hidden border-r border-[#303330] p-9 max-[720px]:min-h-[260px] max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:p-7">
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:18px_18px]"/>
          <div className="relative flex items-center gap-3 text-xs tracking-[0.1em] text-[#e6e7e1] uppercase">
            <span className="grid size-9 place-items-center border border-[#666a66]">
              <LuHeartPulse className="size-[18px]" aria-hidden="true"/>
            </span>
            KeepCare interface
          </div>

          <div className="relative my-auto max-[720px]:my-10">
            <p className="mb-3 text-[9px] tracking-[0.13em] text-[#f0783c] uppercase">Authorized access only</p>
            <h1
              className="text-[clamp(34px,5vw,52px)] leading-none font-medium tracking-[-0.05em] text-[#eeeeea] uppercase">
              Welcome<br/>back.
            </h1>
            <p className="mt-6 max-w-[290px] text-[11px] leading-6 text-[#818580]">
              Access your care workspace and review current task operations.
            </p>
          </div>
        </aside>

        <div className="flex flex-col justify-center p-[clamp(36px,6vw,68px)] max-[720px]:p-7">
          <div className="flex items-center gap-4 border-b border-[#2c2f2c] pb-6">
            <span className="grid size-9 place-items-center border border-[#555955] text-[#f0783c]">
              <LuLockKeyhole aria-hidden="true"/>
            </span>
            <div>
              <h2 className="text-lg font-medium tracking-[0.04em] text-[#e8e9e3] uppercase">Sign in</h2>
            </div>
          </div>

          <form className="mt-7 grid gap-5">
            <label className="grid gap-2.5 text-[9px] tracking-[0.08em] text-[#a8aba6] uppercase">
              Email address
              <input
                className="h-12 w-full rounded-none border border-[#383b38] bg-[#050606] px-3.5 text-[11px] tracking-normal text-[#e6e7e1] normal-case outline-none placeholder:text-[#555955] focus:border-[#f0783c] focus:shadow-[inset_2px_0_0_#f0783c]"
                placeholder="you@example.com"
                type="email"
              />
            </label>

            <label className="grid gap-2.5 text-[9px] tracking-[0.08em] text-[#a8aba6] uppercase">
              Password
              <input
                className="h-12 w-full rounded-none border border-[#383b38] bg-[#050606] px-3.5 text-[11px] tracking-normal text-[#e6e7e1] normal-case outline-none placeholder:text-[#555955] focus:border-[#f0783c] focus:shadow-[inset_2px_0_0_#f0783c]"
                placeholder="Enter your password"
                type="password"
                autoComplete="current-password"
              />
            </label>

            <button
              className="flex h-12 cursor-pointer items-center justify-between border border-[#d8d9d4] bg-[#dedfda] px-4 text-[10px] font-semibold tracking-[0.09em] text-[#090a09] uppercase hover:bg-white"
              type="button">
              Login <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
