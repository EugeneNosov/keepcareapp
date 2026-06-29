import { TASK_REPEAT_UNITS, TASKS_STORAGE_KEY } from '../task.constants.ts';
import type { CreateTaskPayload, Task, TaskRepeatEvery, TaskRepeatUnit, TaskStatus } from '../types/tasks.types.ts'

function writeTasks(tasks: Task[]) {
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeRepeatUnit(unit: unknown): TaskRepeatUnit {
  if (typeof unit === 'string' && TASK_REPEAT_UNITS.includes(unit as TaskRepeatUnit)) {
    return unit as TaskRepeatUnit;
  }

  return 'days';
}

function calculateDueDate(baseDate: string, repeatEvery: TaskRepeatEvery) {
  const dueDate = new Date(baseDate);

  if (Number.isNaN(dueDate.getTime())) {
    return new Date().toISOString();
  }

  if (repeatEvery.unit === 'days') {
    dueDate.setDate(dueDate.getDate() + repeatEvery.value);
  }

  if (repeatEvery.unit === 'weeks') {
    dueDate.setDate(dueDate.getDate() + repeatEvery.value * 7);
  }

  if (repeatEvery.unit === 'months') {
    dueDate.setMonth(dueDate.getMonth() + repeatEvery.value);
  }

  return dueDate.toISOString();
}

function calculateTaskStatus(dueDate: string): TaskStatus {
  const dueDateTime = new Date(dueDate).getTime();

  if (Number.isNaN(dueDateTime)) {
    return 'ok';
  }

  const now = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000;

  if (dueDateTime < now) {
    return 'overdue';
  }

  if (dueDateTime - now <= oneDayInMs) {
    return 'due_soon';
  }

  return 'ok';
}

function normalizeTask(task: unknown): Task | null {
  if (!isRecord(task) || typeof task.id !== 'string' || typeof task.name !== 'string') {
    return null;
  }

  const repeatEvery = isRecord(task.repeatEvery)
    ? {
      value: typeof task.repeatEvery.value === 'number' && task.repeatEvery.value > 0
        ? task.repeatEvery.value
        : 1,
      unit: normalizeRepeatUnit(task.repeatEvery.unit),
    }
    : {
      value: 1,
      unit: 'days' as const,
    };

  const createdAt = typeof task.createdAt === 'string' ? task.createdAt : new Date().toISOString();
  const lastCompletedAt = typeof task.lastCompletedAt === 'string' ? task.lastCompletedAt : null;
  const dueDate = typeof task.dueDate === 'string'
    ? task.dueDate
    : calculateDueDate(lastCompletedAt ?? createdAt, repeatEvery);

  return {
    id: task.id,
    name: task.name,
    status: calculateTaskStatus(dueDate),
    repeatEvery,
    createdAt,
    lastCompletedAt,
    dueDate,
  };
}

function readTasks() {
  const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);

  if (!storedTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(storedTasks);

    if (!Array.isArray(parsedTasks)) {
      writeTasks([]);
      return [];
    }

    const tasks = parsedTasks
      .map(normalizeTask)
      .filter(task => task !== null);

    writeTasks(tasks);

    return tasks;
  } catch {
    writeTasks([]);
    return [];
  }
}

export async function getTasks() {
  return readTasks();
}

export async function createTask(payload: CreateTaskPayload) {
  const tasks = readTasks();
  const createdAt = new Date().toISOString();
  const dueDate = calculateDueDate(createdAt, payload.repeatEvery);
  const task: Task = {
    id: crypto.randomUUID(),
    name: payload.name,
    repeatEvery: payload.repeatEvery,
    createdAt,
    lastCompletedAt: null,
    dueDate,
    status: calculateTaskStatus(dueDate),
  };

  writeTasks([task, ...tasks]);

  return task;
}

export async function markTaskAsCompleted(taskId: string) {
  const tasks = readTasks();
  const completedAt = new Date().toISOString();
  let updatedTask: Task | null = null;

  const updatedTasks = tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    const dueDate = calculateDueDate(completedAt, task.repeatEvery);
    updatedTask = {
      ...task,
      lastCompletedAt: completedAt,
      dueDate,
      status: calculateTaskStatus(dueDate),
    };

    return updatedTask;
  });

  if (!updatedTask) {
    throw new Error('Task was not found');
  }

  writeTasks(updatedTasks);

  return updatedTask;
}

export async function removeTask(taskId: string) {
  const tasks = readTasks();
  writeTasks(tasks.filter((task) => task.id !== taskId));
}
