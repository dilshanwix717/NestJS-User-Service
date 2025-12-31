// FILE: apps/user-service/src/prisma/prisma.module.ts
// ============================================================================
/**
 * PrismaModule
 * ------------
 * Global module that provides PrismaService throughout the application.
 *
 * @Global() - Makes this module's exports available to all other modules
 * without needing to import it explicitly in each module.
 */
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
