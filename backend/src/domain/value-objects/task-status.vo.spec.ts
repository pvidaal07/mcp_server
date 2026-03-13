import { describe, it, expect } from 'vitest';
import { TaskStatus } from './task-status.vo';

describe('TaskStatus Value Object', () => {
  it('PENDING value equals string "PENDING"', () => {
    expect(TaskStatus.PENDING).toBe('PENDING');
  });

  it('COMPLETED value equals string "COMPLETED"', () => {
    expect(TaskStatus.COMPLETED).toBe('COMPLETED');
  });

  it('enum has exactly two members', () => {
    const values = Object.values(TaskStatus);
    expect(values).toHaveLength(2);
  });

  it('PENDING and COMPLETED are not equal', () => {
    expect(TaskStatus.PENDING).not.toBe(TaskStatus.COMPLETED);
  });
});
