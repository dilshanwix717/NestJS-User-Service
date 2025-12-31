// FILE: apps/user-service/src/prisma/prisma.service.ts
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
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * PrismaService
 * --------------------
 * Wraps PrismaClient and provides it throughout the application.
 *
 * Implements OnModuleInit - Runs logic when NestJS finishes initializing the module.
 * Implements OnModuleDestroy - Runs cleanup logic when NestJS shuts down the application.
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  /**
   * Logger instance scoped to this service
   * Example log output: [PrismaService] Database connected successfully
   */
  private readonly logger = new Logger(PrismaService.name);

  /**
   * Prisma client instance - initialized in onModuleInit
   */
  private _client!: PrismaClient;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Getter to access the Prisma client
   */
  get client(): PrismaClient {
    return this._client;
  }

  // Proxy common Prisma properties for backward compatibility
  get userProfile() {
    return this._client.userProfile;
  }

  get userSettings() {
    return this._client.userSettings;
  }

  get userStatus() {
    return this._client.userStatus;
  }

  get subscription() {
    return this._client.subscription;
  }

  /**
   * Execute a transaction
   */
  $transaction<T>(fn: Parameters<PrismaClient['$transaction']>[0]): Promise<T> {
    return this._client.$transaction(fn) as Promise<T>;
  }

  /**
   * onModuleInit() - Automatically called by NestJS when the module is initialized.
   * Purpose:
   * - Initialize Prisma client with database connection
   * - Establish database connection
   * - Fail early if the database is unreachable
   */
  async onModuleInit(): Promise<void> {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('Missing required environment variable: DATABASE_URL');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- pg Pool typing limitation
    const pool: Pool = new Pool({ connectionString: databaseUrl });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- @prisma/adapter-pg typing limitation
    const adapter: PrismaPg = new PrismaPg(pool);

    this._client = new PrismaClient({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Prisma adapter typing limitation
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });

    await this._client.$connect();
    this.logger.log('✅ User Service Database connected successfully');
  }

  /**
   * onModuleDestroy() - Automatically called by NestJS during app shutdown.
   * Purpose:
   * - Gracefully close database connections
   * - Prevent open handles and memory leaks
   */
  async onModuleDestroy(): Promise<void> {
    await this._client.$disconnect();
    this.logger.log('User Service Database disconnected');
  }
}
