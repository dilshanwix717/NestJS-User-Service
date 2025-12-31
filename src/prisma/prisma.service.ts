/**
 * PrismaService
 * --------------
 * Centralized Prisma ORM service for User Service.
 *
 * Responsibilities:
 * - Manage database connections
 * - Provide Prisma Client across the application
 * - Handle lifecycle hooks for clean startup & shutdown
 */
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * PrismaService
 * --------------------
 * Extends PrismaClient so repositories/services can directly access:
 * - this.userProfile.findMany()
 * - this.userSettings.update()
 * - this.$transaction()
 *
 * Implements:
 * - OnModuleInit: connect to DB on startup
 * - OnModuleDestroy: disconnect cleanly on shutdown
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Logger instance scoped to this service
   */
  private readonly logger = new Logger(PrismaService.name);

  /**
   * Constructor
   * -----------
   * Initializes PostgreSQL connection pool
   * and passes it to Prisma via PrismaPg adapter.
   */
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('Missing required environment variable: DATABASE_URL');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pool = new Pool({
      connectionString: databaseUrl,
    });

    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      adapter: new PrismaPg(pool),
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  /**
   * Called once the NestJS module has been initialized
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('✅ User Service Database connected successfully');
  }

  /**
   * Called during NestJS application shutdown
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('User Service Database disconnected');
  }
}
