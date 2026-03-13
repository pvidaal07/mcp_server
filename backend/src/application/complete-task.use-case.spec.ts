import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompleteTaskUseCase } from './complete-task.use-case';
import { createMockTaskRepository } from '../../test/helpers/mock-task-repository';
import { createMockTask } from '../../test/helpers/task-factory';
import { TaskStatus } from '../domain/value-objects/task-status.vo';
import type { ITaskRepository } from '../domain/repositories/task.repository';

describe('CompleteTaskUseCase', () => {
  let useCase: CompleteTaskUseCase;
  let mockRepo: ITaskRepository;

  beforeEach(() => {
    mockRepo = createMockTaskRepository();
    useCase = new CompleteTaskUseCase(mockRepo);
  });

  it('completes an existing PENDING task', async () => {
    const task = createMockTask({ id: 'task-1', status: TaskStatus.PENDING });
    vi.mocked(mockRepo.findById).mockResolvedValue(task);
    vi.mocked(mockRepo.save).mockResolvedValue(task);

    const result = await useCase.execute('task-1');

    expect(mockRepo.findById).toHaveBeenCalledWith('task-1');
    expect(mockRepo.save).toHaveBeenCalledOnce();
    expect(result.status).toBe(TaskStatus.COMPLETED);
  });

  it('throws when task is not found', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    await expect(useCase.execute('nonexistent')).rejects.toThrow(
      'Tarea nonexistent no encontrada',
    );
  });

  it('throws when task is already completed', async () => {
    const task = createMockTask({ id: 'task-1', status: TaskStatus.COMPLETED });
    vi.mocked(mockRepo.findById).mockResolvedValue(task);

    await expect(useCase.execute('task-1')).rejects.toThrow(
      'La tarea ya está completada',
    );
  });
});
