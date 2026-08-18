import { useId, useState } from 'react';
import { LuTriangleAlert, LuTrash2 } from 'react-icons/lu';
import Button from '@/components/Button/Button.tsx';
import Checkbox from '@/components/Checkbox/Checkbox.tsx';
import Dialog from '@/components/Dialog/Dialog.tsx';

type DeleteTaskDialogProps = {
  isDeleting: boolean;
  isDisabled: boolean;
  onDelete: (deleteHistory: boolean) => void;
  taskName: string;
};

export default function DeleteTaskDialog({
                                           isDeleting,
                                           isDisabled,
                                           onDelete,
                                           taskName,
                                         }: DeleteTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteFromHistory, setDeleteFromHistory] = useState(false);
  const deleteHistoryWarningId = useId();

  function openDialog() {
    setDeleteFromHistory(false);
    setIsOpen(true);
  }

  function closeDialog() {
    setDeleteFromHistory(false);
    setIsOpen(false);
  }

  function handleConfirmDelete() {
    onDelete(deleteFromHistory);
    closeDialog();
  }

  return (
    <>
      <button
        aria-label={isDeleting ? `Deleting ${taskName}` : `Delete ${taskName}`}
        className="grid size-10 cursor-pointer place-items-center rounded-pill bg-danger-surface text-danger-muted transition-colors hover:bg-danger-surface-hover hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isDeleting || isDisabled}
        onClick={openDialog}
        type="button"
      >
        <LuTrash2 className="size-3.5" aria-hidden="true"/>
      </button>

      {isOpen && (
        <Dialog isOpen={isOpen} onClose={closeDialog} title="Delete task">
          <div className="grid gap-5">
            <p className="text-sm leading-6 text-text-muted">
              Are you sure you want to delete <span className="text-text-app">"{taskName}"</span>? This action cannot
              be undone.
            </p>

            <div className="grid gap-3">
              <Checkbox
                aria-describedby={deleteFromHistory ? deleteHistoryWarningId : undefined}
                checked={deleteFromHistory}
                disabled={isDeleting}
                label="Delete from history"
                onChange={(event) => setDeleteFromHistory(event.target.checked)}
              />

              {deleteFromHistory ? (
                <div
                  className="flex items-start gap-3 rounded-control border border-danger-border bg-danger-surface px-4 py-3 text-danger-text"
                  id={deleteHistoryWarningId}
                  role="alert"
                >
                  <LuTriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true"/>
                  <p className="text-[11px] leading-5">
                    All history for this task will be permanently removed. It will no longer appear on the History page.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                label="Cancel"
                onClick={closeDialog}
                variant="secondary"
              />
              <Button
                disabled={isDeleting}
                label={isDeleting ? 'Deleting...' : 'Delete task'}
                onClick={handleConfirmDelete}
              />
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}
