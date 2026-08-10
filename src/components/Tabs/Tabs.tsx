import {
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { IconType } from 'react-icons';

export interface TabItem<T extends string> {
  value: T;
  label: string;
  icon?: IconType;
  content: ReactNode;
}

interface TabsProps<T extends string> {
  ariaLabel: string;
  items: readonly TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  panelClassName?: string;
}

export default function Tabs<T extends string>({
                                                 ariaLabel,
                                                 items,
                                                 value,
                                                 onChange,
                                                 className,
                                                 panelClassName,
                                               }: TabsProps<T>) {
  const id = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectTab(index: number) {
    const nextItem = items[index];

    if (!nextItem) {
      return;
    }

    onChange(nextItem.value);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % items.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectTab(nextIndex);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className={`inline-flex rounded-control border border-border-app bg-surface p-1 max-[520px]:flex ${className ?? ''}`}
        role="tablist"
      >
        {items.map(({value: itemValue, label, icon: Icon}, index) => {
          const isSelected = value === itemValue;

          return (
            <button
              aria-controls={`${id}-panel-${index}`}
              aria-selected={isSelected}
              className={`inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[9px] px-4 text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-[520px]:flex-1 max-[520px]:gap-1.5 max-[520px]:px-2 ${
                isSelected
                  ? 'bg-surface-muted text-text-strong'
                  : 'text-text-subtle hover:bg-surface-hover hover:text-text-soft'
              }`}
              id={`${id}-tab-${index}`}
              key={itemValue}
              onClick={() => onChange(itemValue)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
            >
              {Icon ? (
                <Icon className={`size-3.5 ${isSelected ? 'text-primary' : ''}`} aria-hidden="true"/>
              ) : null}
              {label}
            </button>
          );
        })}
      </div>

      {items.map(({value: itemValue, content}, index) => (
        <div
          aria-labelledby={`${id}-tab-${index}`}
          className={panelClassName}
          hidden={value !== itemValue}
          id={`${id}-panel-${index}`}
          key={itemValue}
          role="tabpanel"
          tabIndex={0}
        >
          {content}
        </div>
      ))}
    </>
  );
}
