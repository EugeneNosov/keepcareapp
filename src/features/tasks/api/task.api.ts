import { apiRequest } from '@/shared/api';
import type {
  CreateTaskPayload,
  Task,
  TaskListItem,
  TaskSummary,
  UpdateTaskPayload,
} from '../types/tasks.types.ts';

export function getTasks() {
  return apiRequest<TaskListItem[]>('/tasks');
}

export function getTaskDetails(taskId: string) {
  return apiRequest<Task>(`/tasks/${taskId}`);
}

export function getTaskSummary() {
  return apiRequest<TaskSummary>('/tasks/summary');
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
