import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaTaskRepository } from './prisma-task.repository';
import { createMockPrismaService } from '../../../test/helpers/mock-prisma-service';
import { createPrismaTaskRecord } from '../../../test/helpers/task-factory';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/value-objects/task-status.vo';

describe('PrismaTaskRepository', () => {
  let repository: PrismaTaskRepository;
  let mockPrisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(() => {
    mockPrisma = createMockPrismaService();
    repository = new PrismaTaskRepository(mockPrisma as any);
  });

  describe('findAll', () => {
    it('returns all tasks mapped to domain entities', async () => {
      const records = [
        createPrismaTaskRecord({ id: '1', title: 'Tarea 1' }),
        createPrismaTaskRecord({ id: '2', title: 'Tarea 2' }),
      ];
      mockPrisma.task.findMany.mockResolvedValue(records);

      const result = await repository.findAll();

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Task);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('returns empty array when no records exist', async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('returns a domain task when record exists', async () => {
      const record = createPrismaTaskRecord({ id: 'found-id' });
      mockPrisma.task.findUnique.mockResolvedValue(record);

      const result = await repository.findById('found-id');

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 'found-id' } });
      expect(result).toBeInstanceOf(Task);
      expect(result!.id).toBe('found-id');
    });

    it('returns null when record does not exist', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      const result = await repository.findById('missing-id');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('upserts and returns the domain task', async () => {
      const task = new Task('task-1', 'Title', 'Desc', TaskStatus.PENDING, new Date(), new Date());
      const record = createPrismaTaskRecord({ id: 'task-1', title: 'Title', description: 'Desc' });
      mockPrisma.task.upsert.mockResolvedValue(record);

      const result = await repository.save(task);

      expect(mockPrisma.task.upsert).toHaveBeenCalledWith({
        where: { id: 'task-1' },
        update: {
          title: 'Title',
          description: 'Desc',
          status: TaskStatus.PENDING,
        },
        create: {
          id: 'task-1',
          title: 'Title',
          description: 'Desc',
          status: TaskStatus.PENDING,
        },
      });
      expect(result).toBeInstanceOf(Task);
    });
  });

  describe('delete', () => {
    it('deletes the record by id', async () => {
      mockPrisma.task.delete.mockResolvedValue(undefined);

      await repository.delete('task-1');

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: 'task-1' } });
    });
  });
});
