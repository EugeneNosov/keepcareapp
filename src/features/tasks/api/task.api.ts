import { apiRequest } from '@/shared/api';
import type { CreateTaskPayload, Task } from '../types/tasks.types.ts';

export function getTasks() {
  return apiRequest<Task[]>('/tasks');
}

export function createTask(payload: CreateTaskPayload) {
  return apiRequest<Task>('/tasks', {
    method: 'POST',
    body: payload,
  });
}

export function markTaskAsCompleted(taskId: string) {
  return apiRequest<Task>(`/tasks/${taskId}/complete`, {
    method: 'PATCH',
  });
}

export function removeTask(taskId: string) {
  return apiRequest<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
