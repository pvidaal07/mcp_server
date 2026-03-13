import { Task } from '../../src/domain/entities/task.entity';
import { TaskStatus } from '../../src/domain/value-objects/task-status.vo';

export interface MockTaskOverrides {
  id?: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export function createMockTask(overrides: MockTaskOverrides = {}): Task {
  return new Task(
    overrides.id ?? 'test-uuid-1',
    overrides.title ?? 'Test Task',
    overrides.description !== undefined ? overrides.description : 'Test description',
    overrides.status ?? TaskStatus.PENDING,
    overrides.createdAt ?? new Date('2025-01-01T00:00:00.000Z'),
    overrides.updatedAt ?? new Date('2025-01-01T00:00:00.000Z'),
  );
}

export function createPrismaTaskRecord(overrides: MockTaskOverrides = {}) {
  return {
    id: overrides.id ?? 'test-uuid-1',
    title: overrides.title ?? 'Test Task',
    description: overrides.description !== undefined ? overrides.description : 'Test description',
    status: overrides.status ?? TaskStatus.PENDING,
    createdAt: overrides.createdAt ?? new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: overrides.updatedAt ?? new Date('2025-01-01T00:00:00.000Z'),
  };
}
