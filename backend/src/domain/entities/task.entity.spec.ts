import { describe, it, expect, vi } from 'vitest';
import { Task } from './task.entity';
import { TaskStatus } from '../value-objects/task-status.vo';

describe('Task Entity', () => {
  describe('constructor', () => {
    it('creates a task with all required fields', () => {
      const createdAt = new Date('2025-01-01');
      const updatedAt = new Date('2025-01-01');
      const task = new Task('uuid-1', 'Mi tarea', 'Descripción', TaskStatus.PENDING, createdAt, updatedAt);

      expect(task.id).toBe('uuid-1');
      expect(task.title).toBe('Mi tarea');
      expect(task.description).toBe('Descripción');
      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.createdAt).toEqual(createdAt);
      expect(task.updatedAt).toEqual(updatedAt);
    });

    it('allows null description', () => {
      const task = new Task('uuid-2', 'Tarea', null, TaskStatus.PENDING, new Date(), new Date());
      expect(task.description).toBeNull();
    });
  });

  describe('complete()', () => {
    it('transitions a PENDING task to COMPLETED', () => {
      const task = new Task('uuid-1', 'Tarea', null, TaskStatus.PENDING, new Date(), new Date());
      task.complete();
      expect(task.status).toBe(TaskStatus.COMPLETED);
    });

    it('updates updatedAt when completing', () => {
      vi.useFakeTimers();
      const originalDate = new Date('2025-01-01');
      const task = new Task('uuid-1', 'Tarea', null, TaskStatus.PENDING, originalDate, originalDate);

      const laterDate = new Date('2025-06-15');
      vi.setSystemTime(laterDate);

      task.complete();
      expect(task.updatedAt).toEqual(laterDate);

      vi.useRealTimers();
    });

    it('throws when task is already completed', () => {
      const task = new Task('uuid-1', 'Tarea', null, TaskStatus.COMPLETED, new Date(), new Date());

      expect(() => task.complete()).toThrow('La tarea ya está completada');
    });
  });
});
