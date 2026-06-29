import { useQuery } from '@tanstack/react-query'
import { getTasks } from '../api/task.api.ts'
import { TASK_QUERY_KEYS } from '../task.constants.ts'

export default function useTasks() {
  const tasksQuery = useQuery({
    queryKey: TASK_QUERY_KEYS.all,
    queryFn: getTasks,
  })

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error ? 'Unable to load tasks.' : null,
  }
}
