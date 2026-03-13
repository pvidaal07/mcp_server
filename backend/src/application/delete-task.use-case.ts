// src/application/delete-task.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import type { ITaskRepository } from '../domain/repositories/task.repository';
import { TASK_REPOSITORY } from '../domain/repositories/task.repository';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: ITaskRepository,
  ) {}

  async execute(taskId: string): Promise<void> {
    await this.taskRepo.delete(taskId);
  }
}
