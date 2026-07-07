import { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import Button from '@/components/Button/Button.tsx';
import Dialog from '@/components/Dialog/Dialog.tsx';

type DeleteTaskDialogProps = {
  isDeleting: boolean;
  isDisabled: boolean;
  onDelete: () => void;
  taskName: string;
};

export default function DeleteTaskDialog({
                                           isDeleting,
                                           isDisabled,
                                           onDelete,
                                           taskName,
                                         }: DeleteTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeDialog() {
    setIsOpen(false);
  }

  function handleConfirmDelete() {
    onDelete();
    closeDialog();
  }

  return (
    <>
      <button
        aria-label={isDeleting ? `Deleting ${taskName}` : `Delete ${taskName}`}
        className="grid size-10 cursor-pointer place-items-center rounded-full bg-[#201716] text-[#b86358] transition-colors hover:bg-[#321c19] hover:text-[#e36f5e] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isDeleting || isDisabled}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <LuTrash2 className="size-3.5" aria-hidden="true"/>
      </button>

      {isOpen && (
        <Dialog isOpen={isOpen} onClose={closeDialog} title="Delete task">
          <div className="grid gap-5">
            <p className="text-sm leading-6 text-[#b7bab5]">
              Are you sure you want to delete <span className="text-[#eeeeea]">"{taskName}"</span>? This action cannot
              be undone.
            </p>
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
