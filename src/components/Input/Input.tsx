import React, { type InputHTMLAttributes, type Ref, type TextareaHTMLAttributes } from 'react';

type InputProps = {
  label: string;
  id: string;
  wrapperClassName?: string;
  isTextArea?: boolean;
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
} & InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>;

const fieldClassName = 'w-full rounded-control border border-border-muted bg-surface-raised px-4 text-sm text-text-app outline-none transition-colors placeholder:text-text-disabled hover:border-border-strong focus:border-primary';

const Input = ({
                 label,
                 id,
                 wrapperClassName,
                 isTextArea = false,
                 className,
                 ref,
                 ...props
               }: InputProps) => {
  const inputClassName = `${fieldClassName} ${className ?? ''}`;

  const field = isTextArea ? (
    <textarea
      ref={ref as React.Ref<HTMLTextAreaElement>}
      id={id}
      {...props}
      className={`${inputClassName} min-h-28 resize-y py-3`}
    />
  ) : (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      id={id}
      {...props}
      className={`${inputClassName} h-control`}
    />
  );

  return (
    <div className={`flex flex-col gap-2 ${wrapperClassName ?? ''}`}>
      <label htmlFor={id} className="text-xs text-text-muted">
        {label}
      </label>
      {field}
    </div>
  )
};

export default Input;
