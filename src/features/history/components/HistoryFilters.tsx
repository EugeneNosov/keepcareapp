import { useEffect, useId, useRef, useState } from 'react';
import {
  LuChevronDown,
  LuListFilter,
  LuRotateCcw,
} from 'react-icons/lu';
import Checkbox from '@/components/Checkbox/Checkbox.tsx';
import {
  HISTORY_DEFAULT_FILTERS,
  HISTORY_EVENT_TYPES,
} from '../history.constants.ts';
import type {
  TaskHistoryEventType,
  TaskHistoryFilters as TaskHistoryFiltersValue,
} from '../types/history.types.ts';

const eventTypeOptions = [
  {label: 'Task completed', value: 'task_completed'},
  {label: 'Task updated', value: 'task_updated'},
  {label: 'Task deleted', value: 'task_deleted'},
  {label: 'Task created', value: 'task_created'},
] as const;

interface HistoryFiltersProps {
  filters: TaskHistoryFiltersValue;
  onChange: (filters: TaskHistoryFiltersValue) => void;
}

export default function HistoryFilters({
                                         filters,
                                         onChange,
                                       }: HistoryFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeFilterCount = (
    filters.eventTypes.length !== HISTORY_EVENT_TYPES.length ? 1 : 0
  ) + (filters.includeDeletedTasks ? 0 : 1);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleEventTypeChange(
    eventType: TaskHistoryEventType,
    isChecked: boolean,
  ) {
    const selectedEventTypes = new Set(filters.eventTypes);

    if (isChecked) {
      selectedEventTypes.add(eventType);
    } else {
      selectedEventTypes.delete(eventType);
    }

    const eventTypes = HISTORY_EVENT_TYPES.filter((type) =>
      selectedEventTypes.has(type),
    );

    if (eventTypes.length > 0) {
      onChange({...filters, eventTypes});
    }
  }

  function handleReset() {
    onChange(HISTORY_DEFAULT_FILTERS);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={activeFilterCount > 0
          ? `Filter history, ${activeFilterCount} active`
          : 'Filter history'}
        className={`inline-flex h-8 cursor-pointer items-center gap-2 rounded-pill border px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isOpen || activeFilterCount > 0
            ? 'border-primary/50 bg-surface-selected text-primary'
            : 'border-border-app bg-surface text-text-muted hover:border-border-strong hover:text-text-soft'
        }`}
        onClick={() => setIsOpen(currentValue => !currentValue)}
        type="button"
      >
        <LuListFilter className="size-3.5" aria-hidden="true"/>
        Filter
        {activeFilterCount > 0 ? (
          <span className="grid size-4 place-items-center rounded-pill bg-primary text-[9px] font-medium text-primary-text">
            {activeFilterCount}
          </span>
        ) : null}
        <LuChevronDown
          className={`size-3 text-text-disabled transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <form
          aria-label="History filters"
          className="absolute top-[calc(100%+0.5rem)] right-0 z-30 w-72 overflow-hidden rounded-card border border-border-strong bg-surface-raised shadow-2xl shadow-black/50 max-[420px]:w-[calc(100vw-3rem)]"
          id={panelId}
          onReset={handleReset}
          role="dialog"
        >
          <div className="flex items-start justify-between gap-4 border-b border-border-app px-4 py-3.5">
            <div>
              <h3 className="text-xs font-medium text-text-strong">Filter activity</h3>
              <p className="mt-1 text-[10px] leading-4 text-text-subtle">
                Choose what appears in your history.
              </p>
            </div>
            <button
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-sm px-1 py-0.5 text-[10px] text-text-subtle transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:text-text-disabled"
              disabled={activeFilterCount === 0}
              type="reset"
            >
              <LuRotateCcw className="size-3" aria-hidden="true"/>
              Reset
            </button>
          </div>

          <div className="p-2">
            <fieldset>
              <legend
                className="px-2.5 pt-1.5 pb-1 text-[9px] font-medium tracking-[0.08em] text-text-disabled uppercase">
                Event types
              </legend>
              {eventTypeOptions.map(option => (
                <Checkbox
                  checked={filters.eventTypes.includes(option.value)}
                  disabled={
                    filters.eventTypes.length === 1
                    && filters.eventTypes.includes(option.value)
                  }
                  key={option.value}
                  label={option.label}
                  name="eventTypes"
                  onChange={(event) => handleEventTypeChange(
                    option.value,
                    event.target.checked,
                  )}
                  value={option.value}
                />
              ))}
            </fieldset>

            <div className="my-2 border-t border-border-app"/>

            <fieldset>
              <legend className="px-2.5 pb-1 text-[9px] font-medium tracking-[0.08em] text-text-disabled uppercase">
                Tasks
              </legend>
              <Checkbox
                checked={filters.includeDeletedTasks}
                description="Show activity from tasks that are now deleted."
                label="Include deleted tasks"
                name="includeDeletedTasks"
                onChange={(event) => onChange({
                  ...filters,
                  includeDeletedTasks: event.target.checked,
                })}
              />
            </fieldset>
          </div>
        </form>
      ) : null}
    </div>
  );
}
