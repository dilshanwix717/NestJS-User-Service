// FILE: apps/user-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { SettingsModule } from './settings/settings.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { StatusModule } from './status/status.module';

/**
 * @Module() - Defines module metadata for NestJS
 *
 * Properties:
 * - imports: External modules this module depends on
 * - controllers: HTTP controllers (empty for microservice)
 * - providers: Services, factories, custom providers
 */
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({ isGlobal: true }),

    // Prisma ORM service for database operations
    PrismaModule,

    // User domain modules
    ProfileModule,
    SettingsModule,
    SubscriptionModule,
    StatusModule,
  ],

  // Empty for microservice (uses message patterns instead of HTTP routes)
  controllers: [],

  // Global providers available to all modules
  providers: [],
})
export class AppModule {}
