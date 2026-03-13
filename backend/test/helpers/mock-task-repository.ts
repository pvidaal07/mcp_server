import { vi } from 'vitest';
import type { ITaskRepository } from '../../src/domain/repositories/task.repository';

export function createMockTaskRepository(): ITaskRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  };
}
