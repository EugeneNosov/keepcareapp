import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { LuCheck } from 'react-icons/lu';
import Button from '@/components/Button/Button.tsx';
import Dialog from '@/components/Dialog/Dialog.tsx';
import Input from '@/components/Input/Input.tsx';
import { isInlineRequestError } from '@/shared/api';
import type {
  CompleteTaskPayload,
  TaskListItem,
} from '../types/tasks.types.ts';
import {
  COMPLETION_NOTE_MAX_LENGTH,
  completeTaskFormSchema,
  type CompleteTaskFormData,
} from '../validation/complete-task-form.schema.ts';
import CompleteTaskButton from './CompleteTaskButton.tsx';

const initialCompleteTaskFormData: CompleteTaskFormData = {
  note: '',
};

interface CompleteTaskDialogProps {
  className?: string;
  isCompleting: boolean;
  isDisabled?: boolean;
  onComplete: (payload: CompleteTaskPayload) => void | Promise<void>;
  task: TaskListItem;
}

export default function CompleteTaskDialog({
                                             className,
                                             isCompleting,
                                             isDisabled = false,
                                             onComplete,
                                             task,
                                           }: CompleteTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const noteDescriptionId = useId();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<CompleteTaskFormData>({
    defaultValues: initialCompleteTaskFormData,
    resolver: zodResolver(completeTaskFormSchema),
    mode: 'onChange',
  });
  const noteLength = useWatch({control, name: 'note'}).length;
  const isPending = isCompleting || isSubmitting;

  function openDialog() {
    reset(initialCompleteTaskFormData);
    setRequestError(null);
    setIsOpen(true);
  }

  function closeDialog() {
    reset(initialCompleteTaskFormData);
    setRequestError(null);
    setIsOpen(false);
  }

  async function handleComplete({note}: CompleteTaskFormData) {
    setRequestError(null);

    try {
      await onComplete({
        taskId: task.id,
        ...(note ? {note} : {}),
      });
      closeDialog();
    } catch (error) {
      setRequestError(
        isInlineRequestError(error)
          ? error.message
          : 'Could not complete the task. Please try again.',
      );
    }
  }

  return (
    <>
      <CompleteTaskButton
        className={className}
        isCompleting={isCompleting}
        isDisabled={isDisabled}
        onClick={openDialog}
        task={task}
      />

      {isOpen && (
        <Dialog isOpen={isOpen} onClose={closeDialog} title="Complete task">
          <form className="grid gap-5" onSubmit={handleSubmit(handleComplete)}>
            <p className="text-sm leading-6 text-text-muted">
              You’re completing <span className="text-text-app">“{task.name}”</span>.
            </p>

            <div className="grid gap-2">
              <Input
                aria-describedby={noteDescriptionId}
                autoFocus
                id="completion-note"
                isTextArea
                label="Completion note (optional)"
                maxLength={COMPLETION_NOTE_MAX_LENGTH}
                placeholder="What did you do?"
                aria-invalid={Boolean(errors.note)}
                {...register('note')}
              />
              <div
                className="flex items-center justify-between gap-4 text-[10px] text-text-disabled"
                id={noteDescriptionId}
              >
                <span className="shrink-0 tabular-nums">
                  {noteLength} / {COMPLETION_NOTE_MAX_LENGTH}
                </span>
              </div>
            </div>

            {errors.note?.message && (
              <div
                className="rounded-control border border-danger-border bg-danger-surface px-4 py-3 text-xs text-danger-text"
                role="alert"
              >
                {errors.note.message}
              </div>
            )}

            {requestError && (
              <div
                className="rounded-control border border-danger-border bg-danger-surface px-4 py-3 text-xs text-danger-text"
                role="alert"
              >
                {requestError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                disabled={isPending}
                label="Cancel"
                onClick={closeDialog}
                variant="secondary"
              />
              <Button
                disabled={isPending || Boolean(errors.note)}
                icon={LuCheck}
                label={isPending ? 'Completing...' : 'Complete task'}
                type="submit"
              />
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
}
