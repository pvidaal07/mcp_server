import { vi } from 'vitest';

export function createMockPrismaService() {
  return {
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
}
