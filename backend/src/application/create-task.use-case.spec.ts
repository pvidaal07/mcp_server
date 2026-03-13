import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTaskUseCase } from './create-task.use-case';
import { createMockTaskRepository } from '../../test/helpers/mock-task-repository';
import { createMockTask } from '../../test/helpers/task-factory';
import { TaskStatus } from '../domain/value-objects/task-status.vo';
import type { ITaskRepository } from '../domain/repositories/task.repository';

// Mock randomUUID
vi.mock('crypto', () => ({
  randomUUID: () => 'mocked-uuid',
}));

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockRepo: ITaskRepository;

  beforeEach(() => {
    mockRepo = createMockTaskRepository();
    useCase = new CreateTaskUseCase(mockRepo);
  });

  it('creates a task with title and description', async () => {
    const savedTask = createMockTask({ id: 'mocked-uuid', title: 'Nueva tarea', description: 'Desc' });
    vi.mocked(mockRepo.save).mockResolvedValue(savedTask);

    const result = await useCase.execute({ title: 'Nueva tarea', description: 'Desc' });

    expect(mockRepo.save).toHaveBeenCalledOnce();
    const callArg = vi.mocked(mockRepo.save).mock.calls[0][0];
    expect(callArg.id).toBe('mocked-uuid');
    expect(callArg.title).toBe('Nueva tarea');
    expect(callArg.description).toBe('Desc');
    expect(callArg.status).toBe(TaskStatus.PENDING);
    expect(result).toEqual(savedTask);
  });

  it('sets description to null when not provided', async () => {
    const savedTask = createMockTask({ id: 'mocked-uuid', title: 'Sin desc', description: null });
    vi.mocked(mockRepo.save).mockResolvedValue(savedTask);

    await useCase.execute({ title: 'Sin desc' });

    const callArg = vi.mocked(mockRepo.save).mock.calls[0][0];
    expect(callArg.description).toBeNull();
  });
});
