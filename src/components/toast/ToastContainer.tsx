import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { LuCircleAlert, LuX } from 'react-icons/lu';
import {
  getActiveToast,
  subscribeToToast,
  toast,
} from './toast.ts';
import { TOAST_DURATION } from '@/app.constants.ts';

export default function ToastContainer() {
  const activeToast = useSyncExternalStore(
    subscribeToToast,
    getActiveToast,
  );

  useEffect(() => {
    if (!activeToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      toast.dismiss(activeToast.id);
    }, TOAST_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [activeToast]);

  const toastRoot = document.getElementById('toast-root');

  if (!toastRoot || !activeToast) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 z-100 border-t border-[#63342f] bg-[#25100e] px-6 py-4 text-[#e98a7c] shadow-[0_-16px_48px_rgba(0,0,0,0.35)] max-[640px]:px-4"
      role="alert"
    >
      <div className="mx-auto flex w-full max-w-265 items-center gap-3">
        <LuCircleAlert className="size-5 shrink-0" aria-hidden="true"/>
        <p className="min-w-0 flex-1 text-sm leading-6">
          {activeToast.message}
        </p>
        <button
          aria-label="Dismiss notification"
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-[#b87166] hover:bg-[#361815] hover:text-[#f2a195] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e98a7c]"
          onClick={() => toast.dismiss(activeToast.id)}
          type="button"
        >
          <LuX className="size-4" aria-hidden="true"/>
        </button>
      </div>
    </div>,
    toastRoot,
  );
}
