// FILE: apps/user-service/src/subscription/subscription.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller()
export class SubscriptionController {
  private readonly logger = new Logger(SubscriptionController.name);

  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Create subscription
   * Pattern: 'user.subscription.create'
   */
  @MessagePattern('user.subscription.create')
  async create(dto: CreateSubscriptionDto) {
    this.logger.log(
      'Received user.subscription.create message:',
      dto.userProfileId,
    );

    try {
      return await this.subscriptionService.create(dto);
    } catch (error) {
      this.logger.error('Error creating subscription:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Subscription creation failed',
      });
    }
  }

  /**
   * Get subscription by ID
   * Pattern: 'user.subscription.findById'
   */
  @MessagePattern('user.subscription.findById')
  async findById(payload: { id: string }) {
    this.logger.log('Received user.subscription.findById message:', payload.id);

    try {
      return await this.subscriptionService.findById(payload.id);
    } catch (error) {
      this.logger.error('Error finding subscription:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Subscription not found',
      });
    }
  }

  /**
   * Get active subscription for user
   * Pattern: 'user.subscription.findActiveByUserProfileId'
   */
  @MessagePattern('user.subscription.findActiveByUserProfileId')
  async findActiveByUserProfileId(payload: { userProfileId: string }) {
    this.logger.log(
      'Received user.subscription.findActiveByUserProfileId message:',
      payload.userProfileId,
    );

    try {
      return await this.subscriptionService.findActiveByUserProfileId(
        payload.userProfileId,
      );
    } catch (error) {
      this.logger.error('Error finding active subscription:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Subscription not found',
      });
    }
  }

  /**
   * Get all subscriptions for user
   * Pattern: 'user.subscription.findAllByUserProfileId'
   */
  @MessagePattern('user.subscription.findAllByUserProfileId')
  async findAllByUserProfileId(payload: { userProfileId: string }) {
    this.logger.log(
      'Received user.subscription.findAllByUserProfileId message:',
      payload.userProfileId,
    );

    try {
      return await this.subscriptionService.findAllByUserProfileId(
        payload.userProfileId,
      );
    } catch (error) {
      this.logger.error('Error finding subscriptions:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to find subscriptions',
      });
    }
  }

  /**
   * Update subscription
   * Pattern: 'user.subscription.update'
   */
  @MessagePattern('user.subscription.update')
  async update(payload: { id: string; dto: UpdateSubscriptionDto }) {
    this.logger.log('Received user.subscription.update message:', payload.id);

    try {
      return await this.subscriptionService.update(payload.id, payload.dto);
    } catch (error) {
      this.logger.error('Error updating subscription:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Subscription update failed',
      });
    }
  }

  /**
   * Cancel subscription
   * Pattern: 'user.subscription.cancel'
   */
  @MessagePattern('user.subscription.cancel')
  async cancel(payload: { id: string }) {
    this.logger.log('Received user.subscription.cancel message:', payload.id);

    try {
      return await this.subscriptionService.cancel(payload.id);
    } catch (error) {
      this.logger.error('Error canceling subscription:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Subscription cancellation failed',
      });
    }
  }

  /**
   * Suspend subscription
   * Pattern: 'user.subscription.suspend'
   */
  @MessagePattern('user.subscription.suspend')
  async suspend(payload: { id: string; reason?: string }) {
    this.logger.log('Received user.subscription.suspend message:', payload.id);

    try {
      return await this.subscriptionService.suspend(payload.id, payload.reason);
    } catch (error) {
      this.logger.error('Error suspending subscription:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Subscription suspension failed',
      });
    }
  }

  /**
   * Activate subscription
   * Pattern: 'user.subscription.activate'
   */
  @MessagePattern('user.subscription.activate')
  async activate(payload: { id: string }) {
    this.logger.log('Received user.subscription.activate message:', payload.id);

    try {
      return await this.subscriptionService.activate(payload.id);
    } catch (error) {
      this.logger.error('Error activating subscription:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Subscription activation failed',
      });
    }
  }

  /**
   * Soft delete subscription
   * Pattern: 'user.subscription.delete'
   */
  @MessagePattern('user.subscription.delete')
  async delete(payload: { id: string }) {
    this.logger.log('Received user.subscription.delete message:', payload.id);

    try {
      await this.subscriptionService.softDelete(payload.id);
      return { success: true, message: 'Subscription deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting subscription:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Subscription deletion failed',
      });
    }
  }

  /**
   * Check if subscription is expired
   * Pattern: 'user.subscription.checkExpiration'
   */
  @MessagePattern('user.subscription.checkExpiration')
  async checkExpiration(payload: { id: string }) {
    this.logger.log(
      'Received user.subscription.checkExpiration message:',
      payload.id,
    );

    try {
      const isExpired = await this.subscriptionService.checkExpiration(
        payload.id,
      );
      return { isExpired };
    } catch (error) {
      this.logger.error('Error checking subscription expiration:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Expiration check failed',
      });
    }
  }

  /**
   * Get subscriptions expiring soon
   * Pattern: 'user.subscription.findExpiringSoon'
   */
  @MessagePattern('user.subscription.findExpiringSoon')
  async findExpiringSoon(payload: { days?: number }) {
    this.logger.log(
      'Received user.subscription.findExpiringSoon message:',
      payload.days,
    );

    try {
      return await this.subscriptionService.findExpiringSoon(payload.days);
    } catch (error) {
      this.logger.error('Error finding expiring subscriptions:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to find expiring subscriptions',
      });
    }
  }
}
