// src/application/create-task.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../domain/entities/task.entity';
import { TaskStatus } from '../domain/value-objects/task-status.vo';
import type { ITaskRepository } from '../domain/repositories/task.repository';
import { TASK_REPOSITORY } from '../domain/repositories/task.repository';
import { randomUUID } from 'crypto';

export interface CreateTaskInput {
  title: string;
  description?: string;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: ITaskRepository,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const task = new Task(
      randomUUID(),
      input.title,
      input.description ?? null,
      TaskStatus.PENDING,
      new Date(),
      new Date(),
    );
    return this.taskRepo.save(task);
  }
}
