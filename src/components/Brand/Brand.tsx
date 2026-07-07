import { LuHeartPulse } from 'react-icons/lu';

export default function Brand() {
  return (
    <div className="relative flex items-center gap-2.5 text-sm font-medium text-text-app">
      <span className="grid size-8 place-items-center rounded-pill bg-primary text-primary-text">
        <LuHeartPulse className="size-4" aria-hidden="true"/>
      </span>
      KeepCare
    </div>
  )
}
