// src/domain/entities/task.entity.ts
import { TaskStatus } from '../value-objects/task-status.vo';

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public status: TaskStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  complete(): void {
    if (this.status === TaskStatus.COMPLETED) {
      throw new Error('La tarea ya está completada');
    }
    this.status = TaskStatus.COMPLETED;
    this.updatedAt = new Date();
  }
}
