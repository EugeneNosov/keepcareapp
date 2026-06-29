import { LuActivity, LuArrowUpRight, LuCheck, LuClock3 } from 'react-icons/lu'
import { Link } from 'react-router'

const metrics = [
  {label: 'Active', value: '04', icon: LuActivity, color: '#f0a43c'},
  {label: 'Completed', value: '18', icon: LuCheck, color: '#4bd49b'},
  {label: 'Pending', value: '03', icon: LuClock3, color: '#d6d7d2'},
]

const tasks = [
  {name: 'Morning medication', owner: 'You', status: 'IN PROGRESS', due: '08:30', color: '#f0a43c'},
  {name: 'Schedule health check', owner: 'Family', status: 'PENDING', due: 'Tomorrow', color: '#d6d7d2'},
  {name: 'Update care notes', owner: 'You', status: 'COMPLETE', due: '12:10', color: '#4bd49b'},
]

export function TasksListPage() {
  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <header className="border border-[#343734] bg-[#080909]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#242624] px-5 py-4">
          <div>
            <p className="m-0 text-[9px] tracking-[0.14em] text-[#777b77] uppercase">
              KeepCare control interface
            </p>
            <h1 className="mt-1.5 text-lg font-medium tracking-[0.05em] text-[#ededE8] uppercase">
              Task operations
            </h1>
          </div>
          <span
            className="border border-[#783d34] bg-[#25100e] px-2.5 py-1 text-[9px] tracking-[0.12em] text-[#e36f5e] uppercase">
            Private workspace
          </span>
        </div>
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-[9px] tracking-[0.06em] text-[#8d918c] uppercase">
          <span>Operator: <strong className="font-medium text-[#d9dad5]">Primary user</strong></span>
          <span>System status: <strong className="bg-[#173422] px-1.5 py-0.5 font-medium text-[#68d792]">Online</strong></span>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-3 gap-5 max-[860px]:grid-cols-1">
        {metrics.map(({label, value, icon: Icon, color}) => (
          <article className="border border-[#383b38] bg-[#080909] p-5" key={label}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.1em] text-[#939792] uppercase">{label}</span>
              <Icon className="size-4" style={{color}} aria-hidden="true"/>
            </div>
            <strong className="mt-5 block text-3xl font-semibold tracking-[-0.04em] text-[#f2f2ed]">
              {value}
            </strong>
            <div className="mt-4 h-1 bg-[#222522]">
              <span className="block h-full w-3/5" style={{backgroundColor: color}}/>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-6 border border-[#383b38] bg-[#080909]">
        <header className="flex items-center justify-between border-b border-[#303330] px-5 py-4">
          <h2
            className="flex items-center gap-2.5 text-xs font-medium tracking-[0.08em] text-[#e2e3de] uppercase before:block before:h-5 before:w-0.5 before:bg-[#f0783c]">
            Task registry
          </h2>
          <span className="text-[9px] tracking-[0.1em] text-[#747873] uppercase">03 records</span>
        </header>

        <div className="overflow-x-auto">
          <div className="min-w-[650px]">
            <div
              className="grid grid-cols-[2fr_1fr_1fr_1fr_32px] gap-4 border-b border-[#242624] px-5 py-3 text-[9px] tracking-[0.08em] text-[#70746f] uppercase">
              <span>Task name</span>
              <span>Owner</span>
              <span>Status</span>
              <span>Deadline</span>
              <span/>
            </div>
            {tasks.map(task => (
              <div
                className="grid grid-cols-[2fr_1fr_1fr_1fr_32px] items-center gap-4 border-b border-[#202220] px-5 py-[18px] text-[11px] last:border-b-0 hover:bg-[#0d0f0e]"
                key={task.name}
              >
                <span className="text-[#dcddd7]">{task.name}</span>
                <span className="text-[#898d88]">{task.owner}</span>
                <span className="flex items-center gap-2 text-[9px] tracking-[0.04em]" style={{color: task.color}}>
                  <i className="size-1.5 rounded-full not-italic" style={{backgroundColor: task.color}}/>
                  {task.status}
                </span>
                <span className="text-[#a4a7a2]">{task.due}</span>
                <Link className="text-[#8c908b] hover:text-[#f0783c]" to="/tasks/example-task"
                      aria-label={`Open ${task.name}`}>
                  <LuArrowUpRight className="size-4" aria-hidden="true"/>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}
