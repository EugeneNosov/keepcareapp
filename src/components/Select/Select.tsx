import type { Ref, SelectHTMLAttributes } from 'react';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  label: string;
  id: string;
  options: SelectOption[];
  wrapperClassName?: string;
  ref?: Ref<HTMLSelectElement>;
} & SelectHTMLAttributes<HTMLSelectElement>;

const fieldClassName = 'h-12 w-full rounded-xl border border-[#303330] bg-[#191b19] px-4 text-sm text-[#eeeeea] outline-none transition-colors hover:border-[#454945] focus:border-[#f0783c]';

const Select = ({
                  label,
                  id,
                  options,
                  wrapperClassName,
                  className,
                  ref,
                  ...props
                }: SelectProps) => {
  return (
    <div className={`flex flex-col gap-2 ${wrapperClassName ?? ''}`}>
      <label htmlFor={id} className="text-xs text-[#a8aba6]">
        {label}
      </label>
      <select
        ref={ref}
        id={id}
        {...props}
        className={`${fieldClassName} ${className ?? ''}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
};

export default Select;
