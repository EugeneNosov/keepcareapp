import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeTask } from '../api/task.api.ts'
import { TASK_QUERY_KEYS } from '../task.constants.ts'

export default function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeTask,
    onSuccess: () => queryClient.invalidateQueries({queryKey: TASK_QUERY_KEYS.all}),
  })
}
