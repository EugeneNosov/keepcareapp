import React from 'react';

type InputProps = {
  label: string;
  id: string;
  wrapperClassName?: string;
  isTextArea?: boolean;
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
} & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const fieldClassName = 'w-full rounded-xl border border-[#303330] bg-[#191b19] px-4 text-sm text-[#eeeeea] outline-none transition-colors placeholder:text-[#666b66] hover:border-[#454945] focus:border-[#f0783c]';

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
      className={`${inputClassName} h-12`}
    />
  );

  return (
    <div className={`flex flex-col gap-2 ${wrapperClassName ?? ''}`}>
      <label htmlFor={id} className="text-xs text-[#a8aba6]">
        {label}
      </label>
      {field}
    </div>
  )
};

export default Input;
