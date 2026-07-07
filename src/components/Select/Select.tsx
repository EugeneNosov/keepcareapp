import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type Ref,
  type SelectHTMLAttributes
} from 'react';
import { createPortal } from 'react-dom';

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

const buttonClassName = 'flex h-control w-full cursor-pointer items-center justify-between rounded-control border border-border-muted bg-surface-raised px-4 text-sm text-text-app outline-none transition-colors hover:border-border-strong focus:border-primary disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-disabled';
const optionClassName = 'flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-text-app transition-colors hover:bg-border-app hover:text-text-strong';

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

const Select = ({
                  label,
                  id,
                  options,
                  wrapperClassName,
                  className,
                  ref,
                  name,
                  onBlur,
                  onChange,
                  defaultValue,
                  value,
                  disabled,
                  ...props
                }: SelectProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>();
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);
  const [selectedValue, setSelectedValue] = useState(
    String(value ?? defaultValue ?? options[0]?.value ?? ''),
  );
  const currentValue = value !== undefined ? String(value) : selectedValue;

  const selectedOption = useMemo(
    () => options.find(option => option.value === currentValue) ?? options[0],
    [options, currentValue],
  );

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !wrapperRef.current?.contains(target)
        && !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    function handleWindowChange() {
      setIsOpen(false);
    }

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);

    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, []);

  function openMenu() {
    const buttonRect = buttonRef.current?.getBoundingClientRect();

    if (!buttonRect) {
      return;
    }

    setMenuStyle({
      left: buttonRect.left,
      top: buttonRect.bottom + 8,
      width: buttonRect.width,
    });
    setPortalContainer(wrapperRef.current?.closest('dialog') ?? document.body);
    setIsOpen(true);
  }

  function handleToggleMenu() {
    if (disabled) {
      return;
    }

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    openMenu();
  }

  function handleSelect(option: SelectOption) {
    if (disabled) {
      return;
    }

    setSelectedValue(option.value);
    setIsOpen(false);

    if (selectRef.current) {
      selectRef.current.value = option.value;
    }

    onChange?.({
      target: {
        name,
        value: option.value,
      },
      currentTarget: {
        name,
        value: option.value,
      },
    } as ChangeEvent<HTMLSelectElement>);
  }

  return (
    <div ref={wrapperRef} className={`relative flex flex-col gap-2 ${wrapperClassName ?? ''}`}>
      <label htmlFor={id} className="text-xs text-text-muted">
        {label}
      </label>
      <select
        ref={element => {
          selectRef.current = element;
          setRef(ref, element);
        }}
        id={id}
        name={name}
        defaultValue={selectedValue}
        disabled={disabled}
        onBlur={onBlur}
        onChange={onChange}
        {...props}
        className="sr-only"
        tabIndex={-1}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        ref={buttonRef}
        className={`${buttonClassName} ${isOpen ? 'border-primary' : ''} ${className ?? ''}`}
        disabled={disabled}
        onClick={handleToggleMenu}
        type="button"
      >
        <span>{selectedOption?.label}</span>
        <svg className={`size-4 text-text-soft transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true"
             viewBox="0 0 24 24" fill="none">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
        </svg>
      </button>
      {isOpen && portalContainer && createPortal(
        <div
          ref={menuRef}
          className="fixed z-50 rounded-control border border-border-strong bg-surface-raised p-1.5 shadow-2xl shadow-black/40"
          role="listbox"
          style={menuStyle}
        >
          {options.map(option => {
            const isSelected = option.value === currentValue;

            return (
              <button
                key={option.value}
                className={`${optionClassName} ${isSelected ? 'bg-surface-selected text-primary' : ''}`}
                onClick={() => handleSelect(option)}
                role="option"
                type="button"
                aria-selected={isSelected}
              >
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>,
        portalContainer,
      )}
    </div>
  )
};

export default Select;
