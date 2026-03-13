import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaService } from './prisma.service';

// Mock the PrismaClient and PrismaPg to avoid real DB connections
vi.mock('../../generated/prisma/client', () => {
  return {
    PrismaClient: class MockPrismaClient {
      constructor(_opts?: any) {}
      $connect = vi.fn().mockResolvedValue(undefined);
      $disconnect = vi.fn().mockResolvedValue(undefined);
    },
  };
});

vi.mock('@prisma/adapter-pg', () => {
  return {
    PrismaPg: class MockPrismaPg {
      constructor(_opts?: any) {}
    },
  };
});

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    service = new PrismaService();
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  it('calls $connect on module init', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('calls $disconnect on module destroy', async () => {
    await service.onModuleDestroy();
    expect(service.$disconnect).toHaveBeenCalled();
  });
});
