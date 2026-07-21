import Card from '@/components/Card/Card.tsx';
import type { Task } from '../types/tasks.types.ts';

interface TaskNotesProps {
  notes: Task['notes'];
}

export default function TaskNotes({notes}: TaskNotesProps) {
  return (
    <Card className="p-6 shadow-none">
      <h2 className="text-sm font-medium text-text-soft">Notes</h2>
      <p className={`mt-5 whitespace-pre-wrap text-sm leading-7 ${notes ? 'text-text-muted' : 'text-text-disabled'}`}>
        {notes || 'No notes have been added to this task.'}
      </p>
    </Card>
  );
}
