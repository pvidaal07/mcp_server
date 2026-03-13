import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TASK_REPOSITORY } from '../src/domain/repositories/task.repository';
import { createMockTaskRepository } from './helpers/mock-task-repository';
import { createMockTask } from './helpers/task-factory';
import { TaskStatus } from '../src/domain/value-objects/task-status.vo';
import type { ITaskRepository } from '../src/domain/repositories/task.repository';
import { PrismaService } from '../src/infrastructure/persistence/prisma.service';

describe('Tasks E2E', () => {
  let app: INestApplication;
  let mockRepo: ITaskRepository;

  beforeAll(async () => {
    mockRepo = createMockTaskRepository();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(TASK_REPOSITORY)
      .useValue(mockRepo)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.mocked(mockRepo.findAll).mockReset();
    vi.mocked(mockRepo.findById).mockReset();
    vi.mocked(mockRepo.save).mockReset();
    vi.mocked(mockRepo.delete).mockReset();
  });

  describe('POST /tasks', () => {
    it('creates a new task', async () => {
      const task = createMockTask({ title: 'E2E Task', description: 'E2E Desc' });
      vi.mocked(mockRepo.save).mockResolvedValue(task);

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'E2E Task', description: 'E2E Desc' })
        .expect(201);

      expect(response.body.title).toBe('E2E Task');
      expect(response.body.description).toBe('E2E Desc');
      expect(mockRepo.save).toHaveBeenCalledOnce();
    });
  });

  describe('GET /tasks', () => {
    it('returns all tasks', async () => {
      const tasks = [
        createMockTask({ id: '1', title: 'Task 1' }),
        createMockTask({ id: '2', title: 'Task 2' }),
      ];
      vi.mocked(mockRepo.findAll).mockResolvedValue(tasks);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Task 1');
    });

    it('returns empty array when no tasks', async () => {
      vi.mocked(mockRepo.findAll).mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    it('completes a task', async () => {
      const task = createMockTask({ id: 'task-1', status: TaskStatus.PENDING });
      vi.mocked(mockRepo.findById).mockResolvedValue(task);
      // After complete() is called, the task status changes in-place
      vi.mocked(mockRepo.save).mockImplementation(async (t) => t);

      const response = await request(app.getHttpServer())
        .patch('/tasks/task-1/complete')
        .expect(200);

      expect(response.body.status).toBe(TaskStatus.COMPLETED);
    });

    it('returns 500 when task not found', async () => {
      vi.mocked(mockRepo.findById).mockResolvedValue(null);

      await request(app.getHttpServer())
        .patch('/tasks/nonexistent/complete')
        .expect(500);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deletes a task', async () => {
      vi.mocked(mockRepo.delete).mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete('/tasks/task-1')
        .expect(200);

      expect(mockRepo.delete).toHaveBeenCalledWith('task-1');
    });
  });
});
