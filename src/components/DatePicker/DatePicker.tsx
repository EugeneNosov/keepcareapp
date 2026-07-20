import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import {
  LuCalendarDays,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
} from 'react-icons/lu';
import { DayPicker, type ChevronProps } from 'react-day-picker';
import 'react-day-picker/style.css';
import './DatePicker.css';

interface DatePickerProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  ref?: Ref<HTMLButtonElement>;
  'aria-invalid'?: boolean;
}

const displayDateFormatter = new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function parseDateValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return undefined;
  }

  const [, year, month, day] = match;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    parsedDate.getFullYear() !== Number(year)
    || parsedDate.getMonth() !== Number(month) - 1
    || parsedDate.getDate() !== Number(day)
  ) {
    return undefined;
  }

  return parsedDate;
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function CalendarChevron({className, orientation, size = 16}: ChevronProps) {
  const Icon = orientation === 'left'
    ? LuChevronLeft
    : orientation === 'right'
      ? LuChevronRight
      : orientation === 'up'
        ? LuChevronUp
        : LuChevronDown;

  return <Icon aria-hidden="true" className={className} size={size}/>;
}

export default function DatePicker({
                                     id,
                                     label,
                                     name,
                                     value,
                                     onBlur,
                                     onChange,
                                     ref,
                                     'aria-invalid': ariaInvalid,
                                   }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({left: 0, top: 0});
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedDate = parseDateValue(value);

  function setTriggerRef(element: HTMLButtonElement | null) {
    triggerRef.current = element;

    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  }

  const updatePopoverPosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const viewportPadding = 16;
    const popoverGap = 8;
    const triggerRect = trigger.getBoundingClientRect();
    const popoverWidth = Math.min(304, window.innerWidth - viewportPadding * 2);
    const popoverHeight = popoverRef.current?.offsetHeight ?? 352;
    const availableBelow = window.innerHeight - triggerRect.bottom - viewportPadding;
    const availableAbove = triggerRect.top - viewportPadding;
    const shouldPlaceAbove = availableBelow < popoverHeight && availableAbove > availableBelow;
    const left = Math.min(
      Math.max(triggerRect.left, viewportPadding),
      window.innerWidth - popoverWidth - viewportPadding,
    );
    const preferredTop = shouldPlaceAbove
      ? triggerRect.top - popoverHeight - popoverGap
      : triggerRect.bottom + popoverGap;
    const top = Math.min(
      Math.max(preferredTop, viewportPadding),
      window.innerHeight - popoverHeight - viewportPadding,
    );

    setPopoverPosition({left, top});
  }, []);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePopoverPosition();
    }
  }, [isOpen, updatePopoverPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        !containerRef.current?.contains(target)
        && !popoverRef.current?.contains(target)
      ) {
        setIsOpen(false);
        onBlur();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      onBlur();
      triggerRef.current?.focus();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape, true);
    document.addEventListener('scroll', updatePopoverPosition, true);
    window.addEventListener('resize', updatePopoverPosition);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape, true);
      document.removeEventListener('scroll', updatePopoverPosition, true);
      window.removeEventListener('resize', updatePopoverPosition);
    };
  }, [isOpen, onBlur, updatePopoverPosition]);

  function selectDate(date: Date) {
    onChange(formatDateValue(date));
    onBlur();
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function clearDate() {
    onChange('');
    onBlur();
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label className="text-xs text-text-muted" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <button
          aria-controls={`${id}-calendar`}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-invalid={ariaInvalid}
          className="flex h-control w-full cursor-pointer items-center justify-between gap-4 rounded-control border border-border-muted bg-surface-raised px-4 text-left text-sm text-text-app outline-none transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none"
          id={id}
          name={name}
          onClick={() => {
            if (isOpen) {
              onBlur();
              setIsOpen(false);
              return;
            }

            const dialog = triggerRef.current?.closest('dialog');
            const dialogContent = dialog?.firstElementChild;

            setPortalTarget(
              dialogContent instanceof HTMLElement ? dialogContent : document.body,
            );
            setIsOpen(true);
          }}
          ref={setTriggerRef}
          type="button"
        >
          <span className={selectedDate ? 'text-text-app' : 'text-text-disabled'}>
            {selectedDate ? displayDateFormatter.format(selectedDate) : 'Select date'}
          </span>
          <LuCalendarDays className="size-4 shrink-0 text-text-muted" aria-hidden="true"/>
        </button>

        {isOpen && portalTarget && createPortal(
          <div
            aria-label="Choose start date"
            className="fixed z-50 w-[min(19rem,calc(100vw-2rem))] rounded-control border border-border-app bg-surface p-3 shadow-2xl shadow-black/50"
            id={`${id}-calendar`}
            ref={popoverRef}
            role="dialog"
            style={popoverPosition}
          >
            <DayPicker
              autoFocus
              className="keepcare-calendar"
              components={{Chevron: CalendarChevron}}
              defaultMonth={selectedDate}
              fixedWeeks
              mode="single"
              onSelect={(date) => date && selectDate(date)}
              selected={selectedDate}
              showOutsideDays
              weekStartsOn={1}
            />
            <div className="mt-2 flex items-center justify-between border-t border-border-app pt-2">
              <button
                className="cursor-pointer rounded-control px-2 py-1.5 text-[11px] text-text-subtle transition-colors hover:bg-surface-raised hover:text-text-app focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                onClick={clearDate}
                type="button"
              >
                Clear
              </button>
              <button
                className="cursor-pointer rounded-control px-2 py-1.5 text-[11px] text-primary transition-colors hover:bg-surface-selected focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                onClick={() => selectDate(new Date())}
                type="button"
              >
                Today
              </button>
            </div>
          </div>,
          portalTarget,
        )}
      </div>
    </div>
  );
}
