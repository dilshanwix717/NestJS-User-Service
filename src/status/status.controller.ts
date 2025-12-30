// FILE: apps/user-service/src/status/status.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller()
export class StatusController {
  private readonly logger = new Logger(StatusController.name);

  constructor(private readonly statusService: StatusService) {}

  /**
   * Create user status
   * Pattern: 'user.status.create'
   */
  @MessagePattern('user.status.create')
  async create(dto: CreateStatusDto) {
    this.logger.log('Received user.status.create message:', dto.userProfileId);

    try {
      return await this.statusService.create(dto);
    } catch (error) {
      this.logger.error('Error creating status:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Status creation failed',
      });
    }
  }

  /**
   * Get status by userProfileId
   * Pattern: 'user.status.findByUserProfileId'
   */
  @MessagePattern('user.status.findByUserProfileId')
  async findByUserProfileId(payload: { userProfileId: string }) {
    this.logger.log(
      'Received user.status.findByUserProfileId message:',
      payload.userProfileId,
    );

    try {
      return await this.statusService.findByUserProfileId(
        payload.userProfileId,
      );
    } catch (error) {
      this.logger.error('Error finding status:', error);
      throw new RpcException({
        status: 'error',
        message: error instanceof Error ? error.message : 'Status not found',
      });
    }
  }

  /**
   * Get status by ID
   * Pattern: 'user.status.findById'
   */
  @MessagePattern('user.status.findById')
  async findById(payload: { id: string }) {
    this.logger.log('Received user.status.findById message:', payload.id);

    try {
      return await this.statusService.findById(payload.id);
    } catch (error) {
      this.logger.error('Error finding status:', error);
      throw new RpcException({
        status: 'error',
        message: error instanceof Error ? error.message : 'Status not found',
      });
    }
  }

  /**
   * Update status
   * Pattern: 'user.status.update'
   */
  @MessagePattern('user.status.update')
  async update(payload: { id: string; dto: UpdateStatusDto }) {
    this.logger.log('Received user.status.update message:', payload.id);

    try {
      return await this.statusService.update(payload.id, payload.dto);
    } catch (error) {
      this.logger.error('Error updating status:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Status update failed',
      });
    }
  }

  /**
   * Suspend user
   * Pattern: 'user.status.suspend'
   */
  @MessagePattern('user.status.suspend')
  async suspend(payload: {
    id: string;
    reason: string;
    actionedBy: string;
    expiresAt?: string;
  }) {
    this.logger.log('Received user.status.suspend message:', payload.id);

    try {
      return await this.statusService.suspendUser(
        payload.id,
        payload.reason,
        payload.actionedBy,
        payload.expiresAt ? new Date(payload.expiresAt) : undefined,
      );
    } catch (error) {
      this.logger.error('Error suspending user:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'User suspension failed',
      });
    }
  }

  /**
   * Ban user
   * Pattern: 'user.status.ban'
   */
  @MessagePattern('user.status.ban')
  async ban(payload: { id: string; reason: string; actionedBy: string }) {
    this.logger.log('Received user.status.ban message:', payload.id);

    try {
      return await this.statusService.banUser(
        payload.id,
        payload.reason,
        payload.actionedBy,
      );
    } catch (error) {
      this.logger.error('Error banning user:', error);
      throw new RpcException({
        status: 'error',
        message: error instanceof Error ? error.message : 'User ban failed',
      });
    }
  }

  /**
   * Activate user
   * Pattern: 'user.status.activate'
   */
  @MessagePattern('user.status.activate')
  async activate(payload: { id: string }) {
    this.logger.log('Received user.status.activate message:', payload.id);

    try {
      return await this.statusService.activateUser(payload.id);
    } catch (error) {
      this.logger.error('Error activating user:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'User activation failed',
      });
    }
  }

  /**
   * Soft delete status
   * Pattern: 'user.status.delete'
   */
  @MessagePattern('user.status.delete')
  async delete(payload: { id: string }) {
    this.logger.log('Received user.status.delete message:', payload.id);

    try {
      await this.statusService.softDelete(payload.id);
      return { success: true, message: 'Status deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting status:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Status deletion failed',
      });
    }
  }

  /**
   * Find all suspended users
   * Pattern: 'user.status.findAllSuspended'
   */
  @MessagePattern('user.status.findAllSuspended')
  async findAllSuspended() {
    this.logger.log('Received user.status.findAllSuspended message');

    try {
      return await this.statusService.findAllSuspended();
    } catch (error) {
      this.logger.error('Error finding suspended users:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to find suspended users',
      });
    }
  }

  /**
   * Find all banned users
   * Pattern: 'user.status.findAllBanned'
   */
  @MessagePattern('user.status.findAllBanned')
  async findAllBanned() {
    this.logger.log('Received user.status.findAllBanned message');

    try {
      return await this.statusService.findAllBanned();
    } catch (error) {
      this.logger.error('Error finding banned users:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to find banned users',
      });
    }
  }
}
