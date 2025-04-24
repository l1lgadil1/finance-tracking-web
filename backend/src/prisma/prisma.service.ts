import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      // Optional: Add Prisma Client options here
      // log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    // Prisma recommends connecting explicitly
    await this.$connect();
  }

  async onModuleDestroy() {
    // Gracefully disconnect when the application shuts down
    await this.$disconnect();
  }

  // Optional: Add custom methods for complex queries or transactions if needed
}
