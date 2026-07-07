import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LuX } from 'react-icons/lu'
import Card from '@/components/Card/Card.tsx'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Dialog({isOpen, onClose, title, children}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  const dialogRoot = document.getElementById('dialog-root')

  if (!dialogRoot) {
    return null
  }

  return createPortal(
    <dialog
      aria-labelledby="dialog-title"
      className="fixed inset-0 m-auto max-h-[calc(100vh-2rem)] w-[min(calc(100%-2rem),34rem)] overflow-hidden border-0 bg-transparent p-0 text-text-strong backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      onClose={onClose}
      ref={dialogRef}
    >
      <Card className="overflow-hidden shadow-2xl">
        <header className="flex items-center justify-between gap-4 px-6 pt-6 pb-3">
          <h2
            id="dialog-title"
            className="text-xl font-medium tracking-[-0.03em]"
          >
            {title}
          </h2>
          <button
            aria-label="Close dialog"
            className="grid size-9 cursor-pointer place-items-center rounded-pill bg-surface-raised text-text-muted transition-colors hover:bg-border-app hover:text-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onClose}
            type="button"
          >
            <LuX className="size-4" aria-hidden="true"/>
          </button>
        </header>
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto px-6 pt-3 pb-6">
          {children}
        </div>
      </Card>
    </dialog>,
    dialogRoot,
  )
}
