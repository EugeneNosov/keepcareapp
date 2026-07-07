import type { ButtonHTMLAttributes } from 'react';
import type { IconType } from 'react-icons';

type ButtonVariant = 'primary' | 'secondary';
type ButtonIconPosition = 'left' | 'right';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: IconType;
  iconPosition?: ButtonIconPosition;
  variant?: ButtonVariant;
}

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'h-control bg-primary px-4 font-medium text-primary-text hover:bg-primary-hover focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-primary-disabled disabled:text-primary-disabled-text',
  secondary: 'h-control bg-surface-muted px-4 text-text-muted hover:bg-border-app hover:text-text-strong focus-visible:outline-text-strong disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-text-disabled',
};

export default function Button({
                                 label,
                                 icon: Icon,
                                 iconPosition = 'left',
                                 variant = 'primary',
                                 className,
                                 type = 'button',
                                 ...props
                               }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonStyles[variant]} ${className ?? ''}`}
      type={type}
    >
      {Icon && iconPosition === 'left' && <Icon className="size-4" aria-hidden="true"/>}
      {label}
      {Icon && iconPosition === 'right' && <Icon className="size-4" aria-hidden="true"/>}
    </button>
  )
}
