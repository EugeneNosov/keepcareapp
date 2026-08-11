import {
  LuChevronDown,
  LuHistory,
  LuLoaderCircle,
  LuRefreshCw,
} from 'react-icons/lu';
import Button from '@/components/Button/Button.tsx';
import Card from '@/components/Card/Card.tsx';
import HistoryList from '../components/HistoryList.tsx';
import useTaskHistoryFeed from '../hooks/useTaskHistoryFeed.ts';

export function HistoryPage() {
  const {
    error,
    events,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    loadMoreError,
    retry,
  } = useTaskHistoryFeed();

  function handleLoadMore() {
    void loadMore();
  }

  function handleRetry() {
    void retry();
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
          {!isLoading && !error && events.length > 0 ? (
            <span className="text-xs text-text-subtle">
              {events.length} {events.length === 1 ? 'event' : 'events'} shown
            </span>
          ) : null}
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
              <p className="mt-3 text-sm font-medium text-text-soft">No history yet</p>
              <p className="mt-2 text-xs text-text-subtle">
                Task activity will appear here.
              </p>
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
