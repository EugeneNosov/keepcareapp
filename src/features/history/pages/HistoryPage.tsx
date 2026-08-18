import {
  LuChevronDown,
  LuHistory,
  LuLoaderCircle,
  LuRefreshCw,
} from 'react-icons/lu';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Button from '@/components/Button/Button.tsx';
import Card from '@/components/Card/Card.tsx';
import HistoryFilters from '../components/HistoryFilters.tsx';
import HistoryList from '../components/HistoryList.tsx';
import {
  HISTORY_DEFAULT_FILTERS,
  HISTORY_QUERY_KEYS,
} from '../history.constants.ts';
import useTaskHistoryFeed from '../hooks/useTaskHistoryFeed.ts';
import type { TaskHistoryFilters as TaskHistoryFiltersValue } from '../types/history.types.ts';
import { hasActiveTaskHistoryFilters } from '../utils/history-filters.ts';

export function HistoryPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TaskHistoryFiltersValue>(
    HISTORY_DEFAULT_FILTERS,
  );
  const hasActiveFilters = hasActiveTaskHistoryFilters(filters);
  const {
    error,
    events,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    loadMoreError,
    retry,
  } = useTaskHistoryFeed(filters);

  function handleLoadMore() {
    void loadMore();
  }

  function handleRetry() {
    void retry();
  }

  function handleFiltersChange(nextFilters: TaskHistoryFiltersValue) {
    const filtersAreUnchanged = (
      filters.includeDeletedTasks === nextFilters.includeDeletedTasks
      && filters.eventTypes.length === nextFilters.eventTypes.length
      && filters.eventTypes.every(
        (eventType, index) => eventType === nextFilters.eventTypes[index],
      )
    );

    if (filtersAreUnchanged) {
      return;
    }

    queryClient.removeQueries({
      exact: true,
      queryKey: HISTORY_QUERY_KEYS.feed(nextFilters),
    });
    setFilters(nextFilters);
  }

  function handleResetFilters() {
    handleFiltersChange(HISTORY_DEFAULT_FILTERS);
  }

  return (
    <section className="mx-auto w-full max-w-275">
      <header>
        <p className="mb-3 text-xs font-medium tracking-[0.08em] text-primary uppercase">Activity log</p>
        <h1 className="text-[clamp(36px,5vw,56px)] leading-none font-medium tracking-[-0.055em] text-text-app">
          History
        </h1>
        <p className="mt-4 text-sm text-text-subtle">See what changed across your care list.</p>
      </header>

      <section className="mt-10">
        <header className="mb-4 flex items-center justify-between gap-4 px-1">
          <h2 className="text-sm font-medium text-text-soft">Recent activity</h2>
          <div className="flex items-center gap-3">
            {!isLoading && !error && events.length > 0 ? (
              <span className="text-xs text-text-subtle max-[480px]:hidden">
                {events.length} {events.length === 1 ? 'event' : 'events'} shown
              </span>
            ) : null}
            <HistoryFilters
              filters={filters}
              onChange={handleFiltersChange}
            />
          </div>
        </header>

        {isLoading ? (
          <Card
            aria-live="polite"
            className="grid min-h-48 place-items-center p-6 shadow-none"
            role="status"
          >
            <div className="grid justify-items-center gap-3 text-center">
              <LuLoaderCircle className="size-5 animate-spin text-primary" aria-hidden="true"/>
              <p className="text-xs text-text-subtle">Loading history...</p>
            </div>
          </Card>
        ) : null}

        {!isLoading && error && events.length === 0 ? (
          <Card className="grid min-h-48 place-items-center p-6 text-center shadow-none" role="alert">
            <div>
              <p className="text-sm font-medium text-text-soft">Could not load history.</p>
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
        ) : null}

        {!isLoading && !error && events.length === 0 ? (
          <Card className="grid min-h-48 place-items-center p-6 text-center shadow-none">
            <div>
              <LuHistory className="mx-auto size-5 text-text-disabled" aria-hidden="true"/>
              <p className="mt-3 text-sm font-medium text-text-soft">
                {hasActiveFilters ? 'No matching activity' : 'No history yet'}
              </p>
              <p className="mt-2 text-xs text-text-subtle">
                {hasActiveFilters
                  ? 'Try selecting more event types or include deleted tasks.'
                  : 'Task activity will appear here.'}
              </p>
              {hasActiveFilters ? (
                <Button
                  className="mt-5"
                  icon={LuRefreshCw}
                  label="Reset filters"
                  onClick={handleResetFilters}
                  variant="secondary"
                />
              ) : null}
            </div>
          </Card>
        ) : null}

        {events.length > 0 ? (
          <>
            <HistoryList events={events}/>

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

            {loadMoreError ? (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-control border border-danger/30 bg-danger/5 px-4 py-3" role="alert">
                <p className="text-xs text-danger">Could not load more activity. {loadMoreError}</p>
                <Button
                  className="h-8 px-3 text-xs"
                  icon={LuRefreshCw}
                  label="Try again"
                  onClick={handleLoadMore}
                  variant="secondary"
                />
              </div>
            ) : null}

            {hasMore && !loadMoreError ? (
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
          </>
        ) : null}
      </section>
    </section>
  );
}
