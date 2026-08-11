import { apiRequest } from '@/shared/api';
import type {
  CreateTaskPayload,
  DeleteTaskPayload,
  Task,
  TaskHistoryQuery,
  TaskHistoryResponse,
  TaskListItem,
  TaskSummary,
  UpdateTaskPayload,
} from '../types/tasks.types.ts';

export function getTasks(signal?: AbortSignal) {
  return apiRequest<TaskListItem[]>('/tasks', {signal});
}

export function getTaskDetails(taskId: string, signal?: AbortSignal) {
  return apiRequest<Task>(`/tasks/${taskId}`, {signal});
}

export function getTaskHistory(
  taskId: string,
  query: TaskHistoryQuery = {},
  signal?: AbortSignal,
) {
  const searchParams = new URLSearchParams();

  if (query.limit !== undefined) {
    searchParams.set('limit', String(query.limit));
  }

  if (query.cursor) {
    searchParams.set('cursor', query.cursor);
  }

  const queryString = searchParams.toString();
  const path = `/tasks/${taskId}/history${queryString ? `?${queryString}` : ''}`;

  return apiRequest<TaskHistoryResponse>(path, {signal});
}

export function getTaskSummary(signal?: AbortSignal) {
  return apiRequest<TaskSummary>('/tasks/summary', {signal});
}

export function createTask(payload: CreateTaskPayload) {
  return apiRequest<Task>('/tasks', {
    method: 'POST',
    body: {
      ...payload,
      startsAt: new Date(payload.startsAt).toISOString(),
    },
  });
}

export function markTaskAsCompleted(taskId: string) {
  return apiRequest<Task>(`/tasks/${taskId}/complete`, {
    method: 'PATCH',
  });
}

export function updateTask(taskId: string, payload: UpdateTaskPayload) {
  return apiRequest<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: {
      ...payload,
      startsAt: new Date(payload.startsAt).toISOString(),
    },
  });
}

export function removeTask({taskId, deleteHistory}: DeleteTaskPayload) {
  const searchParams = new URLSearchParams();

  if (deleteHistory) {
    searchParams.set('deleteHistory', 'true');
  }

  const queryString = searchParams.toString();
  const path = `/tasks/${taskId}${queryString ? `?${queryString}` : ''}`;

  return apiRequest<void>(path, {
    method: 'DELETE',
  });
}
