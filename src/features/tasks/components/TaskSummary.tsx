import {
  LuCircleCheck,
  LuClock3,
  LuTriangleAlert,
} from 'react-icons/lu'
import Card from '@/components/Card/Card.tsx';

type TaskSummaryData = {
  dueSoonCount: number;
  okCount: number;
  overdueCount: number;
};

type TaskSummaryProps = {
  summaryData: TaskSummaryData;
};

const metrics = [
  {
    label: 'Overdue',
    icon: LuTriangleAlert,
    color: '#e36f5e',
    valueKey: 'overdueCount',
  },
  {
    label: 'Due soon',
    icon: LuClock3,
    color: '#f0a43c',
    valueKey: 'dueSoonCount',
  },
  {
    label: 'OK',
    icon: LuCircleCheck,
    color: '#4bd49b',
    valueKey: 'okCount',
  },
] as const;

export default function TaskSummary({summaryData}: TaskSummaryProps) {
  return (
    <Card className="mt-10 grid grid-cols-3 p-0 shadow-none max-[660px]:grid-cols-1">
      {metrics.map(({label, icon: Icon, color, valueKey}) => (
        <article
          className="flex items-center gap-4 border-r border-[#292c29] p-5 last:border-r-0 max-[660px]:border-r-0 max-[660px]:border-b max-[660px]:last:border-b-0"
          key={label}
        >
          <span className="grid size-10 place-items-center rounded-full" style={{backgroundColor: `${color}14`, color}}>
            <Icon className="size-4" aria-hidden="true"/>
          </span>
          <div>
            <strong className="text-xl font-medium text-[#e5e6e1]">
              {summaryData[valueKey].toString().padStart(2, '0')}
            </strong>
            <p className="mt-1 text-[11px] text-[#777c76]">{label}</p>
          </div>
        </article>
      ))}
    </Card>
  )
}
