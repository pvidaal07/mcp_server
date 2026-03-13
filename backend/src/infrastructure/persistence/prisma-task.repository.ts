// src/infrastructure/persistence/prisma-task.repository.ts
import { Injectable } from '@nestjs/common';
import { ITaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/value-objects/task-status.vo';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    const records = await this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toDomain);
  }

  async findById(id: string): Promise<Task | null> {
    const record = await this.prisma.task.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async save(task: Task): Promise<Task> {
    const record = await this.prisma.task.upsert({
      where: { id: task.id },
      update: {
        title: task.title,
        description: task.description,
        status: task.status,
      },
      create: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
      },
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }

  private toDomain(record: any): Task {
    return new Task(
      record.id,
      record.title,
      record.description,
      record.status as TaskStatus,
      record.createdAt,
      record.updatedAt,
    );
  }
}
