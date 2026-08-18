import type {
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from 'react';
import { LuCheck } from 'react-icons/lu';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  description?: ReactNode;
  label: ReactNode;
  ref?: Ref<HTMLInputElement>;
  wrapperClassName?: string;
};

export default function Checkbox({
                                   className,
                                   description,
                                   disabled,
                                   label,
                                   ref,
                                   wrapperClassName,
                                   ...props
                                 }: CheckboxProps) {
  return (
    <label
      className={`group flex items-start gap-3 rounded-control px-2.5 py-2 transition-colors ${
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:bg-surface-hover'
      } ${wrapperClassName ?? ''}`}
    >
      <input
        {...props}
        className={`peer sr-only ${className ?? ''}`}
        disabled={disabled}
        ref={ref}
        type="checkbox"
      />
      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-sm border border-border-strong text-transparent transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-text peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
        <LuCheck className="size-3" aria-hidden="true"/>
      </span>
      <span className="min-w-0">
        <span className="block text-xs leading-5 text-text-soft group-hover:text-text-strong">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[10px] leading-4 text-text-subtle">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
