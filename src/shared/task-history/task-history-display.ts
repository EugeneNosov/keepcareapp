import type { IconType } from 'react-icons';
import {
  LuCircleCheck,
  LuCirclePlus,
  LuPencilLine,
  LuTrash2,
} from 'react-icons/lu';
import { formatAppDate } from '@/shared/utils/date.ts';
import type {
  TaskHistoryEvent,
  TaskHistoryUpdatedField,
} from './task-history.types.ts';

interface TaskHistoryDisplayItem {
  color: string;
  date: string;
  description: string;
  icon: IconType;
  note?: string | null;
  title: string;
}

const TASK_HISTORY_FIELD_LABELS: Record<TaskHistoryUpdatedField, string> = {
  name: 'name',
  notes: 'notes',
  startsAt: 'start date',
  repeatEvery: 'repeat schedule',
};

const historyFieldListFormatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

function getUpdatedFieldsDescription(fields: readonly TaskHistoryUpdatedField[]) {
  if (fields.length === 0) {
    return 'Task details were updated.';
  }

  const formattedFields = historyFieldListFormatter.format(
    fields.map((field) => TASK_HISTORY_FIELD_LABELS[field]),
  );

  return `${formattedFields.charAt(0).toUpperCase()}${formattedFields.slice(1)} updated.`;
}

export function getTaskHistoryDisplayItem(
  event: TaskHistoryEvent,
): TaskHistoryDisplayItem {
  if (event.type === 'task_completed') {
    const nextDueDate = formatAppDate(event.details.nextDueAt);

    return {
      color: 'var(--app-color-success)',
      date: event.occurredAt,
      description: nextDueDate ? `Next due date: ${nextDueDate}.` : 'The task was marked as done.',
      icon: LuCircleCheck,
      note: event.details.note,
      title: 'Task completed',
    };
  }

  if (event.type === 'task_updated') {
    return {
      color: 'var(--app-color-primary)',
      date: event.occurredAt,
      description: getUpdatedFieldsDescription(event.details.updatedFields),
      icon: LuPencilLine,
      title: 'Task updated',
    };
  }

  if (event.type === 'task_deleted') {
    return {
      color: 'var(--app-color-danger)',
      date: event.occurredAt,
      description: 'The task was removed from your care list.',
      icon: LuTrash2,
      title: 'Task deleted',
    };
  }

  return {
    color: 'var(--app-color-text-subtle)',
    date: event.occurredAt,
    description: 'The task was added to your care list.',
    icon: LuCirclePlus,
    title: 'Task created',
  };
}
