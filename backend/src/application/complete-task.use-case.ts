// src/application/complete-task.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../domain/entities/task.entity';
import type { ITaskRepository } from '../domain/repositories/task.repository';
import { TASK_REPOSITORY } from '../domain/repositories/task.repository';

@Injectable()
export class CompleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: ITaskRepository,
  ) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new Error(`Tarea ${taskId} no encontrada`);

    task.complete();
    return this.taskRepo.save(task);
  }
}
