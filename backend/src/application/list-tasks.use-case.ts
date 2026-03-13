// src/application/list-tasks.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../domain/entities/task.entity';
import type { ITaskRepository } from '../domain/repositories/task.repository';
import { TASK_REPOSITORY } from '../domain/repositories/task.repository';

@Injectable()
export class ListTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: ITaskRepository,
  ) {}

  async execute(): Promise<Task[]> {
    return this.taskRepo.findAll();
  }
}
