export type MockTaskStatus = 'scheduled' | 'overdue' | 'due_soon' | 'ok';

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

type MockTaskOverrides = Partial<Omit<MockTask, 'repeatEvery'>> & {
  repeatEvery?: Partial<MockTask['repeatEvery']>;
};

const BASE_TASK: MockTask = {
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

export function createTaskFixture(
  overrides: MockTaskOverrides = {},
): MockTask {
  return {
    ...BASE_TASK,
    ...overrides,
    repeatEvery: {
      ...BASE_TASK.repeatEvery,
      ...overrides.repeatEvery,
    },
  };
}

export const DEFAULT_TASK = createTaskFixture();
