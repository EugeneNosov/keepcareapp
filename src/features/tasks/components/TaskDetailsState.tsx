import type { ReactNode } from 'react';

interface TaskDetailsStateProps {
  children: ReactNode;
  role?: 'alert' | 'status';
}

export default function TaskDetailsState({
  children,
  role = 'status',
}: TaskDetailsStateProps) {
  return (
    <section className="mx-auto grid min-h-[60vh] w-full max-w-275 place-items-center">
      <div className="text-center" role={role}>
        {children}
      </div>
    </section>
  );
}
