/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      /**
       * Transport.TCP - Use TCP protocol for inter-service communication
       *
       * Other transports available:
       * - RabbitMQ: Message broker (high-performance)
       * - MQTT: IoT messaging protocol
       * - gRPC: High-performance RPC framework
       * - Kafka: Stream processing
       */
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || '127.0.0.1',
        port: parseInt(process.env.USER_SERVICE_PORT || '8878', 10),
      },
    },
  );

  await app.listen();
  Logger.log(`🚀 User Service is running on TCP port 8878`);
}

// Execute bootstrap function to start the application
bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  // Ensure non-zero exit code so supervisors detect failure
  process.exit(1);
});
