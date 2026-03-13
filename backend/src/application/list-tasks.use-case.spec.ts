import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListTasksUseCase } from './list-tasks.use-case';
import { createMockTaskRepository } from '../../test/helpers/mock-task-repository';
import { createMockTask } from '../../test/helpers/task-factory';
import type { ITaskRepository } from '../domain/repositories/task.repository';

describe('ListTasksUseCase', () => {
  let useCase: ListTasksUseCase;
  let mockRepo: ITaskRepository;

  beforeEach(() => {
    mockRepo = createMockTaskRepository();
    useCase = new ListTasksUseCase(mockRepo);
  });

  it('returns all tasks from the repository', async () => {
    const tasks = [
      createMockTask({ id: '1', title: 'Tarea 1' }),
      createMockTask({ id: '2', title: 'Tarea 2' }),
    ];
    vi.mocked(mockRepo.findAll).mockResolvedValue(tasks);

    const result = await useCase.execute();

    expect(mockRepo.findAll).toHaveBeenCalledOnce();
    expect(result).toEqual(tasks);
  });

  it('returns empty array when no tasks exist', async () => {
    vi.mocked(mockRepo.findAll).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
