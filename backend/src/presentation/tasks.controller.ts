// src/presentation/tasks.controller.ts
import {
  Controller, Get, Post, Patch, Delete,
  Body, Param,
} from '@nestjs/common';
import { CreateTaskUseCase } from '../application/create-task.use-case';
import { ListTasksUseCase } from '../application/list-tasks.use-case';
import { CompleteTaskUseCase } from '../application/complete-task.use-case';
import { DeleteTaskUseCase } from '../application/delete-task.use-case';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly listTasks: ListTasksUseCase,
    private readonly completeTask: CompleteTaskUseCase,
    private readonly deleteTask: DeleteTaskUseCase,
  ) {}

  @Post()
  create(@Body() body: { title: string; description?: string }) {
    return this.createTask.execute(body);
  }

  @Get()
  findAll() {
    return this.listTasks.execute();
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.completeTask.execute(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteTask.execute(id);
  }
}
