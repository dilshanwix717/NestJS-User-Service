// FILE: apps/user-service/src/subscription/subscription.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ISubscription } from '../common/interfaces/subscription.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a subscription for a user
   */
  async create(dto: CreateSubscriptionDto): Promise<ISubscription> {
    this.logger.log(
      `Creating subscription for userProfileId: ${dto.userProfileId}`,
    );

    try {
      // Check if profile exists
      const profile = await this.prisma.userProfile.findFirst({
        where: { id: dto.userProfileId, isDeleted: false },
      });

      if (!profile) {
        throw new NotFoundException(`Profile not found: ${dto.userProfileId}`);
      }

      // Parse JSON metadata if provided
      const metadata = dto.metadata ? JSON.parse(dto.metadata) : null;

      const subscription = await this.prisma.subscription.create({
        data: {
          userProfileId: dto.userProfileId,
          planType: dto.planType,
          status: dto.status || 'inactive',
          billingCycle: dto.billingCycle,
          startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          renewalDate: dto.renewalDate ? new Date(dto.renewalDate) : null,
          trialEndsAt: dto.trialEndsAt ? new Date(dto.trialEndsAt) : null,
          isAutoRenew: dto.isAutoRenew ?? true,
          isTrial: dto.isTrial ?? false,
          maxDevices: dto.maxDevices ?? 1,
          maxProfiles: dto.maxProfiles ?? 1,
          canDownload: dto.canDownload ?? false,
          videoQuality: dto.videoQuality || 'sd',
          adsEnabled: dto.adsEnabled ?? true,
          externalSubscriptionId: dto.externalSubscriptionId,
          paymentMethod: dto.paymentMethod,
          metadata,
        },
      });

      this.logger.log(`Subscription created successfully: ${subscription.id}`);
      return subscription as ISubscription;
    } catch (error) {
      this.logger.error('Error creating subscription:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create subscription');
    }
  }

  /**
   * Find subscription by ID
   */
  async findById(id: string): Promise<ISubscription> {
    this.logger.log(`Finding subscription by id: ${id}`);

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription not found: ${id}`);
    }

    return subscription as ISubscription;
  }

  /**
   * Find active subscription for a user
   */
  async findActiveByUserProfileId(
    userProfileId: string,
  ): Promise<ISubscription | null> {
    this.logger.log(
      `Finding active subscription for userProfileId: ${userProfileId}`,
    );

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userProfileId,
        status: 'active',
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return subscription as ISubscription | null;
  }

  /**
   * Find all subscriptions for a user (including inactive)
   */
  async findAllByUserProfileId(
    userProfileId: string,
  ): Promise<ISubscription[]> {
    this.logger.log(
      `Finding all subscriptions for userProfileId: ${userProfileId}`,
    );

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        userProfileId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return subscriptions as ISubscription[];
  }

  /**
   * Update subscription with optimistic locking
   */
  async update(id: string, dto: UpdateSubscriptionDto): Promise<ISubscription> {
    this.logger.log(`Updating subscription: ${id}`);

    // Check if subscription exists
    const existingSubscription = await this.findById(id);

    // Optimistic locking check
    if (dto.version && existingSubscription.version !== dto.version) {
      throw new ConflictException(
        'Subscription has been modified by another process. Please refresh and try again.',
      );
    }

    try {
      // Parse JSON metadata if provided
      const metadata = dto.metadata ? JSON.parse(dto.metadata) : undefined;

      const updated = await this.prisma.subscription.update({
        where: { id },
        data: {
          planType: dto.planType,
          status: dto.status,
          billingCycle: dto.billingCycle,
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
          renewalDate: dto.renewalDate ? new Date(dto.renewalDate) : undefined,
          canceledAt: dto.canceledAt ? new Date(dto.canceledAt) : undefined,
          suspendedAt: dto.suspendedAt ? new Date(dto.suspendedAt) : undefined,
          trialEndsAt: dto.trialEndsAt ? new Date(dto.trialEndsAt) : undefined,
          isAutoRenew: dto.isAutoRenew,
          isTrial: dto.isTrial,
          maxDevices: dto.maxDevices,
          maxProfiles: dto.maxProfiles,
          canDownload: dto.canDownload,
          videoQuality: dto.videoQuality,
          adsEnabled: dto.adsEnabled,
          externalSubscriptionId: dto.externalSubscriptionId,
          paymentMethod: dto.paymentMethod,
          metadata,
          version: { increment: 1 },
        },
      });

      this.logger.log(`Subscription updated successfully: ${id}`);
      return updated as ISubscription;
    } catch (error) {
      this.logger.error('Error updating subscription:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Subscription not found: ${id}`);
      }
      throw new BadRequestException('Failed to update subscription');
    }
  }

  /**
   * Cancel subscription
   */
  async cancel(id: string): Promise<ISubscription> {
    this.logger.log(`Canceling subscription: ${id}`);

    try {
      const updated = await this.prisma.subscription.update({
        where: { id },
        data: {
          status: 'canceled',
          canceledAt: new Date(),
          isAutoRenew: false,
          version: { increment: 1 },
        },
      });

      this.logger.log(`Subscription canceled successfully: ${id}`);
      return updated as ISubscription;
    } catch (error) {
      this.logger.error('Error canceling subscription:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Subscription not found: ${id}`);
      }
      throw new BadRequestException('Failed to cancel subscription');
    }
  }

  /**
   * Suspend subscription
   */
  async suspend(id: string, reason?: string): Promise<ISubscription> {
    this.logger.log(`Suspending subscription: ${id}`);

    try {
      const updated = await this.prisma.subscription.update({
        where: { id },
        data: {
          status: 'suspended',
          suspendedAt: new Date(),
          metadata: reason ? { suspendReason: reason } : undefined,
          version: { increment: 1 },
        },
      });

      this.logger.log(`Subscription suspended successfully: ${id}`);
      return updated as ISubscription;
    } catch (error) {
      this.logger.error('Error suspending subscription:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Subscription not found: ${id}`);
      }
      throw new BadRequestException('Failed to suspend subscription');
    }
  }

  /**
   * Activate subscription
   */
  async activate(id: string): Promise<ISubscription> {
    this.logger.log(`Activating subscription: ${id}`);

    try {
      const updated = await this.prisma.subscription.update({
        where: { id },
        data: {
          status: 'active',
          suspendedAt: null,
          version: { increment: 1 },
        },
      });

      this.logger.log(`Subscription activated successfully: ${id}`);
      return updated as ISubscription;
    } catch (error) {
      this.logger.error('Error activating subscription:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Subscription not found: ${id}`);
      }
      throw new BadRequestException('Failed to activate subscription');
    }
  }

  /**
   * Soft delete subscription
   */
  async softDelete(id: string): Promise<void> {
    this.logger.log(`Soft deleting subscription: ${id}`);

    // Check if subscription exists
    await this.findById(id);

    try {
      await this.prisma.subscription.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          version: { increment: 1 },
        },
      });

      this.logger.log(`Subscription soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error('Error soft deleting subscription:', error);
      throw new BadRequestException('Failed to delete subscription');
    }
  }

  /**
   * Check if subscription is expired
   */
  async checkExpiration(id: string): Promise<boolean> {
    const subscription = await this.findById(id);

    if (!subscription.endDate) {
      return false; // Lifetime subscription
    }

    return new Date() > new Date(subscription.endDate);
  }

  /**
   * Get subscriptions expiring soon (within days)
   */
  async findExpiringSoon(days: number = 7): Promise<ISubscription[]> {
    this.logger.log(`Finding subscriptions expiring within ${days} days`);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        status: 'active',
        isDeleted: false,
        endDate: {
          lte: futureDate,
          gte: new Date(),
        },
      },
      orderBy: { endDate: 'asc' },
    });

    return subscriptions as ISubscription[];
  }
}
