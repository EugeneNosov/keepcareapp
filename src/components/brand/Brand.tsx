import { LuHeartPulse } from 'react-icons/lu';

export default function Brand() {
  return (
    <div className="relative flex items-center gap-2.5 text-sm font-medium text-[#e6e7e1]">
      <span className="grid size-8 place-items-center rounded-full bg-[#f0783c] text-[#160b06]">
        <LuHeartPulse className="size-4" aria-hidden="true"/>
      </span>
      KeepCare
    </div>
  )
}
