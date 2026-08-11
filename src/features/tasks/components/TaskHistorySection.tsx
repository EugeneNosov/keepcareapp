import {
  LuChevronDown,
  LuHistory,
  LuLoaderCircle,
  LuRefreshCw,
} from 'react-icons/lu';
import Button from '@/components/Button/Button.tsx';
import Card from '@/components/Card/Card.tsx';
import useTaskHistory from '../hooks/useTaskHistory.ts';
import TaskHistory from './TaskHistory.tsx';

interface TaskHistorySectionProps {
  isEnabled: boolean;
  taskId: string;
}

export default function TaskHistorySection({
  isEnabled,
  taskId,
}: TaskHistorySectionProps) {
  const {
    events,
    error,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    retry,
  } = useTaskHistory(taskId, isEnabled);

  function handleLoadMore() {
    void loadMore();
  }

  function handleRetry() {
    void retry();
  }

  if (!isEnabled) {
    return null;
  }

  if (isLoading) {
    return (
      <Card
        aria-live="polite"
        className="grid min-h-40 place-items-center p-6 shadow-none"
        role="status"
      >
        <div className="grid justify-items-center gap-3 text-center">
          <LuLoaderCircle className="size-5 animate-spin text-primary" aria-hidden="true"/>
          <p className="text-xs text-text-subtle">Loading task history...</p>
        </div>
      </Card>
    );
  }

  if (error && events.length === 0) {
    return (
      <Card className="grid min-h-40 place-items-center p-6 text-center shadow-none" role="alert">
        <div>
          <p className="text-sm font-medium text-text-soft">Could not load task history.</p>
          <p className="mt-2 text-xs text-text-subtle">{error}</p>
          <Button
            className="mt-5"
            icon={LuRefreshCw}
            label="Try again"
            onClick={handleRetry}
            variant="secondary"
          />
        </div>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="grid min-h-40 place-items-center p-6 text-center shadow-none">
        <div>
          <LuHistory className="mx-auto size-5 text-text-disabled" aria-hidden="true"/>
          <p className="mt-3 text-sm font-medium text-text-soft">No history yet</p>
          <p className="mt-2 text-xs text-text-subtle">Changes to this task will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <TaskHistory events={events}/>

      {error ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-control border border-danger/30 bg-danger/5 px-4 py-3" role="alert">
          <p className="text-xs text-danger">{error}</p>
          <Button
            className="h-8 px-3 text-xs"
            icon={LuRefreshCw}
            label="Try again"
            onClick={handleRetry}
            variant="secondary"
          />
        </div>
      ) : null}

      {hasMore ? (
        <div className="mt-4 flex justify-center">
          <Button
            disabled={isLoadingMore}
            icon={LuChevronDown}
            label={isLoadingMore ? 'Loading more...' : 'Load more'}
            onClick={handleLoadMore}
            variant="secondary"
          />
        </div>
      ) : null}
    </div>
  );
}
