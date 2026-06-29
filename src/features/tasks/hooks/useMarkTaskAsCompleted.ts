import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markTaskAsCompleted } from '../api/task.api.ts'
import { TASK_QUERY_KEYS } from '../task.constants.ts'

export default function useMarkTaskAsCompleted() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markTaskAsCompleted,
    onSuccess: () => queryClient.invalidateQueries({queryKey: TASK_QUERY_KEYS.all}),
  })
}
