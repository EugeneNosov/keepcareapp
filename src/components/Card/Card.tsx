import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const cardClassName = 'rounded-card border border-border-app bg-surface shadow-2xl shadow-black/30';

export default function Card({
                               children,
                               className,
                               ...props
                             }: CardProps) {
  return (
    <div
      {...props}
      className={`${cardClassName} ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
