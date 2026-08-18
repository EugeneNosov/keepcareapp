import { useEffect, useId, useRef, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

interface ExpandableNoteProps {
  note: string;
}

export default function ExpandableNote({note}: ExpandableNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const contentId = useId();
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const content = contentRef.current;

    if (!content || isExpanded) {
      return;
    }

    function updateOverflow() {
      if (!content) {
        return;
      }

      setCanExpand(content.scrollHeight > content.clientHeight + 1);
    }

    updateOverflow();

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, [isExpanded, note]);

  return (
    <div className="mt-1.5 min-w-0">
      <p
        className={`whitespace-pre-wrap wrap-break-word text-[11px] leading-4 text-text-muted ${isExpanded ? '' : 'line-clamp-2'}`}
        id={contentId}
        ref={contentRef}
      >
        <span className="mr-1.5 text-[9px] tracking-[0.06em] text-text-disabled uppercase">
          Note
        </span>
        {note}
      </p>

      {canExpand && (
        <button
          aria-controls={contentId}
          aria-expanded={isExpanded}
          className="mt-1 inline-flex cursor-pointer items-center gap-1 text-[10px] text-text-subtle transition-colors hover:text-text-strong focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          type="button"
        >
          {isExpanded ? 'Show less' : 'Show more'}
          <LuChevronDown
            aria-hidden="true"
            className={`size-3 transition-transform motion-reduce:transition-none ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </div>
  );
}
