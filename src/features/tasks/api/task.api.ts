import { apiRequest } from '@/shared/api';
import type {
  CreateTaskPayload,
  Task,
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

export function removeTask(taskId: string) {
  return apiRequest<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
