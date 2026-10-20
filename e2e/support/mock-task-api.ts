import type { Page, Route } from '@playwright/test';

type MockTaskStatus = 'scheduled' | 'overdue' | 'due_soon' | 'ok';

export type MockTask = {
  id: string;
  name: string;
  notes: string | null;
  status: MockTaskStatus;
  repeatEvery: {
    value: number;
    unit: 'days' | 'weeks' | 'months';
  };
  createdAt: string;
  startsAt: string;
  lastCompletedAt: string | null;
  dueDate: string;
};

export const DEFAULT_TASK: MockTask = {
  id: 'task-1',
  name: 'Replace water filter',
  notes: 'Use the spare filter from the utility cupboard.',
  status: 'overdue',
  repeatEvery: {
    value: 3,
    unit: 'months',
  },
  createdAt: '2026-01-01T10:00:00.000Z',
  startsAt: '2026-01-10T10:00:00.000Z',
  lastCompletedAt: null,
  dueDate: '2026-10-01T10:00:00.000Z',
};

const TASK_API_PATTERN = /^https?:\/\/[^/]+\/tasks(?:\/.*)?(?:\?.*)?$/;

function cloneTask(task: MockTask): MockTask {
  return structuredClone(task);
}

function taskSummary(tasks: MockTask[]) {
  return {
    scheduledCount: tasks.filter(({status}) => status === 'scheduled').length,
    overdueCount: tasks.filter(({status}) => status === 'overdue').length,
    dueSoonCount: tasks.filter(({status}) => status === 'due_soon').length,
    okCount: tasks.filter(({status}) => status === 'ok').length,
    allCount: tasks.length,
  };
}

async function taskNotFound(route: Route) {
  await route.fulfill({
    status: 404,
    json: {message: 'Task not found.'},
  });
}

export async function mockTaskApi(
  page: Page,
  initialTasks: MockTask[] = [DEFAULT_TASK],
) {
  let tasks = initialTasks.map(cloneTask);

  await page.route(TASK_API_PATTERN, async (route) => {
    const request = route.request();
    const {pathname} = new URL(request.url());
    const method = request.method();

    if (pathname === '/tasks/summary' && method === 'GET') {
      await route.fulfill({json: taskSummary(tasks)});
      return;
    }

    if (pathname === '/tasks' && method === 'GET') {
      await route.fulfill({json: tasks});
      return;
    }

    if (pathname === '/tasks' && method === 'POST') {
      const payload = request.postDataJSON() as {
        name: string;
        notes?: string;
        startsAt: string;
        repeatEvery: MockTask['repeatEvery'];
      };
      const createdTask: MockTask = {
        id: `task-${tasks.length + 1}`,
        name: payload.name,
        notes: payload.notes ?? null,
        status: 'overdue',
        repeatEvery: payload.repeatEvery,
        createdAt: '2026-10-20T08:00:00.000Z',
        startsAt: payload.startsAt,
        lastCompletedAt: null,
        dueDate: payload.startsAt,
      };

      tasks = [createdTask, ...tasks];
      await route.fulfill({status: 201, json: createdTask});
      return;
    }

    const completeMatch = /^\/tasks\/([^/]+)\/complete$/.exec(pathname);

    if (completeMatch && method === 'PATCH') {
      const taskId = decodeURIComponent(completeMatch[1]);
      const taskIndex = tasks.findIndex(({id}) => id === taskId);

      if (taskIndex === -1) {
        await taskNotFound(route);
        return;
      }

      const completedTask: MockTask = {
        ...tasks[taskIndex],
        status: 'ok',
        lastCompletedAt: new Date().toISOString(),
        dueDate: '2027-01-20T10:00:00.000Z',
      };

      tasks = tasks.map((task, index) => index === taskIndex ? completedTask : task);
      await route.fulfill({json: completedTask});
      return;
    }

    const taskMatch = /^\/tasks\/([^/]+)$/.exec(pathname);

    if (!taskMatch) {
      await route.fallback();
      return;
    }

    const taskId = decodeURIComponent(taskMatch[1]);
    const taskIndex = tasks.findIndex(({id}) => id === taskId);

    if (taskIndex === -1) {
      await taskNotFound(route);
      return;
    }

    if (method === 'GET') {
      await route.fulfill({json: tasks[taskIndex]});
      return;
    }

    if (method === 'PATCH') {
      const payload = request.postDataJSON() as {
        name: string;
        notes?: string;
        startsAt: string;
        repeatEvery: MockTask['repeatEvery'];
      };
      const updatedTask: MockTask = {
        ...tasks[taskIndex],
        ...payload,
        notes: payload.notes ?? null,
      };

      tasks = tasks.map((task, index) => index === taskIndex ? updatedTask : task);
      await route.fulfill({json: updatedTask});
      return;
    }

    if (method === 'DELETE') {
      tasks = tasks.filter(({id}) => id !== taskId);
      await route.fulfill({status: 204});
      return;
    }

    await route.fallback();
  });
}

export async function mockCreateTaskFailure(page: Page) {
  await page.route(TASK_API_PATTERN, async (route) => {
    const request = route.request();
    const {pathname} = new URL(request.url());

    if (pathname === '/tasks' && request.method() === 'POST') {
      await route.fulfill({
        status: 500,
        json: {message: 'Task service is unavailable.'},
      });
      return;
    }

    await route.fallback();
  });
}

export async function mockDelayedTaskList(page: Page) {
  let releaseRequest!: () => void;
  const requestCanFinish = new Promise<void>((resolve) => {
    releaseRequest = resolve;
  });

  await page.route(TASK_API_PATTERN, async (route) => {
    const request = route.request();
    const {pathname} = new URL(request.url());

    if (pathname === '/tasks' && request.method() === 'GET') {
      await requestCanFinish;
      await route.fallback();
      return;
    }

    await route.fallback();
  });

  return releaseRequest;
}
