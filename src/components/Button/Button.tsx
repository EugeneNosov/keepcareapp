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
  primary: 'h-12 bg-[#f0783c] px-4 font-medium text-[#160b06] hover:bg-[#ff8a4f] focus-visible:outline-[#f0783c] disabled:cursor-not-allowed disabled:bg-[#493126] disabled:text-[#8c6958]',
  secondary: 'h-12 bg-[#202320] px-4 text-[#aeb2ac] hover:bg-[#292c29] hover:text-white focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-[#191b19] disabled:text-[#686c68]',
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
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonStyles[variant]} ${className ?? ''}`}
      type={type}
    >
      {Icon && iconPosition === 'left' && <Icon className="size-4" aria-hidden="true"/>}
      {label}
      {Icon && iconPosition === 'right' && <Icon className="size-4" aria-hidden="true"/>}
    </button>
  )
}
