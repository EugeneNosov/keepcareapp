import type { Task } from '../types/tasks.types.ts'
import { TASKS_STORAGE_KEY } from '../task.constants.ts';

function writeTasks(tasks: Task[]) {
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function readTasks() {
  const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);

  if (!storedTasks) {
    return [];
  }

  try {
    return JSON.parse(storedTasks) as Task[];
  } catch {
    writeTasks([]);
    return [];
  }
}

export async function getTasks() {
  return readTasks();
}

export async function createTask(task: Task) {
  const tasks = readTasks();
  writeTasks([task, ...tasks]);

  return task;
}

export async function removeTask(taskId: string) {
  const tasks = readTasks();
  writeTasks(tasks.filter((task) => task.id !== taskId));
}
