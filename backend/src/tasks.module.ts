// src/tasks.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/persistence/prisma.service';
import { PrismaTaskRepository } from './infrastructure/persistence/prisma-task.repository';
import { TASK_REPOSITORY } from './domain/repositories/task.repository';
import { CreateTaskUseCase } from './application/create-task.use-case';
import { ListTasksUseCase } from './application/list-tasks.use-case';
import { CompleteTaskUseCase } from './application/complete-task.use-case';
import { DeleteTaskUseCase } from './application/delete-task.use-case';
import { TasksController } from './presentation/tasks.controller';

@Module({
  controllers: [TasksController],
  providers: [
    PrismaService,
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
    CreateTaskUseCase,
    ListTasksUseCase,
    CompleteTaskUseCase,
    DeleteTaskUseCase,
  ],
})
export class TasksModule {}
