import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { createMockTaskRepository } from '../../test/helpers/mock-task-repository';
import type { ITaskRepository } from '../domain/repositories/task.repository';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let mockRepo: ITaskRepository;

  beforeEach(() => {
    mockRepo = createMockTaskRepository();
    useCase = new DeleteTaskUseCase(mockRepo);
  });

  it('deletes a task by id', async () => {
    vi.mocked(mockRepo.delete).mockResolvedValue(undefined);

    await useCase.execute('task-1');

    expect(mockRepo.delete).toHaveBeenCalledWith('task-1');
    expect(mockRepo.delete).toHaveBeenCalledOnce();
  });
});
