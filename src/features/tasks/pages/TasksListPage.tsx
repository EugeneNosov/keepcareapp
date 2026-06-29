import { Link } from 'react-router'

export function TasksListPage() {
  return (
    <section className="mx-auto w-full max-w-[1040px]">
      <header className="flex items-end justify-between gap-6 border-b border-[#2d2e28] pb-7 max-[720px]:flex-col max-[720px]:items-start">
        <div>
          <h1 className="m-0 text-[clamp(34px,5vw,58px)] font-medium tracking-[-0.06em] text-[#f5f5f0]">
            Tasks
          </h1>
          <p className="mt-3.5 text-sm text-[#92938b]">
            Keep track of everything that needs your attention.
          </p>
        </div>
        <span className="border border-[#45463f] px-2.5 py-2 text-[11px] text-[#ffd43b] uppercase">
          01 active
        </span>
      </header>

      <div className="mt-[34px] flex items-center justify-between gap-6 border border-[#2f302a] bg-[rgba(11,12,11,0.76)] p-7 shadow-[inset_3px_0_0_#ffd43b] max-[720px]:flex-col max-[720px]:items-start">
        <div>
          <span className="mb-3 block text-[11px] tracking-[0.1em] text-[#8b8c84] uppercase">
            Current task
          </span>
          <h2 className="mb-2 text-[19px] font-medium">Example task</h2>
          <p className="text-[13px] text-[#85867f]">
            This is a placeholder task for the project skeleton.
          </p>
        </div>
        <Link
          className="shrink-0 border border-[#4c4d45] px-4 py-3 text-xs text-[#ecece7] no-underline hover:border-[#ffd43b] hover:text-[#ffd43b]"
          to="/tasks/example-task"
        >
          View task <span>→</span>
        </Link>
      </div>
    </section>
  )
}
