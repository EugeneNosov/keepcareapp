import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@/shared/api';
import { taskSummaryQueryOptions } from '../task.queries.ts';
import type { TaskSummary } from '../types/tasks.types.ts';

const EMPTY_TASK_SUMMARY: TaskSummary = {
  scheduledCount: 0,
  overdueCount: 0,
  dueSoonCount: 0,
  okCount: 0,
  allCount: 0,
};

export default function useTaskSummary() {
  const taskSummaryQuery = useQuery(taskSummaryQueryOptions());

  return {
    summaryData: taskSummaryQuery.data ?? EMPTY_TASK_SUMMARY,
    isLoading: taskSummaryQuery.isLoading,
    error: taskSummaryQuery.error instanceof ApiError
      ? taskSummaryQuery.error.message
      : taskSummaryQuery.error
        ? 'Unable to load task summary.'
        : null,
  };
}
