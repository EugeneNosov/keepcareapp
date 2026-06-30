import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LuX } from 'react-icons/lu'

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
      className="fixed inset-0 m-auto max-h-[calc(100vh-2rem)] w-[min(calc(100%-2rem),34rem)] overflow-hidden border border-[#525552] bg-[#171817] p-0 text-[#f2f2ee] shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      onClose={onClose}
      ref={dialogRef}
    >
      <header className="flex items-center justify-between gap-4 border-b border-[#3a3c3a] px-5 py-4">
        <h2
          id="dialog-title"
          className="flex items-center gap-3 text-sm font-medium tracking-[0.12em] uppercase before:block before:h-10 before:w-1 before:shrink-0 before:bg-[#f0783c]"
        >
          {title}
        </h2>
        <button
          aria-label="Close dialog"
          className="grid size-8 cursor-pointer place-items-center border border-transparent text-[#a5a8a4] transition-colors hover:border-[#5a5d5a] hover:bg-[#222422] hover:text-[#f2f2ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0783c]"
          onClick={onClose}
          type="button"
        >
          <LuX className="size-4" aria-hidden="true"/>
        </button>
      </header>
      <div className="max-h-[calc(100vh-7rem)] overflow-y-auto p-5">
        {children}
      </div>
    </dialog>,
    dialogRoot,
  )
}
