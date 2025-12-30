// FILE: apps/user-service/src/profile/profile.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}

  /**
   * Create user profile
   * Pattern: 'user.profile.create'
   */
  @MessagePattern('user.profile.create')
  async create(dto: CreateProfileDto) {
    this.logger.log('Received user.profile.create message:', dto.authUserId);

    try {
      return await this.profileService.create(dto);
    } catch (error) {
      this.logger.error('Error creating profile:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Profile creation failed',
      });
    }
  }

  /**
   * Get profile by ID
   * Pattern: 'user.profile.findById'
   */
  @MessagePattern('user.profile.findById')
  async findById(payload: { id: string }) {
    this.logger.log('Received user.profile.findById message:', payload.id);

    try {
      return await this.profileService.findById(payload.id);
    } catch (error) {
      this.logger.error('Error finding profile:', error);
      throw new RpcException({
        status: 'error',
        message: error instanceof Error ? error.message : 'Profile not found',
      });
    }
  }

  /**
   * Get profile by authUserId
   * Pattern: 'user.profile.findByAuthUserId'
   */
  @MessagePattern('user.profile.findByAuthUserId')
  async findByAuthUserId(payload: { authUserId: string }) {
    this.logger.log(
      'Received user.profile.findByAuthUserId message:',
      payload.authUserId,
    );

    try {
      return await this.profileService.findByAuthUserId(payload.authUserId);
    } catch (error) {
      this.logger.error('Error finding profile:', error);
      throw new RpcException({
        status: 'error',
        message: error instanceof Error ? error.message : 'Profile not found',
      });
    }
  }

  /**
   * Get profile with relations
   * Pattern: 'user.profile.findByIdWithRelations'
   */
  @MessagePattern('user.profile.findByIdWithRelations')
  async findByIdWithRelations(payload: { id: string }) {
    this.logger.log(
      'Received user.profile.findByIdWithRelations message:',
      payload.id,
    );

    try {
      return await this.profileService.findByIdWithRelations(payload.id);
    } catch (error) {
      this.logger.error('Error finding profile with relations:', error);
      throw new RpcException({
        status: 'error',
        message: error instanceof Error ? error.message : 'Profile not found',
      });
    }
  }

  /**
   * Update profile
   * Pattern: 'user.profile.update'
   */
  @MessagePattern('user.profile.update')
  async update(payload: { id: string; dto: UpdateProfileDto }) {
    this.logger.log('Received user.profile.update message:', payload.id);

    try {
      return await this.profileService.update(payload.id, payload.dto);
    } catch (error) {
      this.logger.error('Error updating profile:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Profile update failed',
      });
    }
  }

  /**
   * Soft delete profile
   * Pattern: 'user.profile.delete'
   */
  @MessagePattern('user.profile.delete')
  async delete(payload: { id: string }) {
    this.logger.log('Received user.profile.delete message:', payload.id);

    try {
      await this.profileService.softDelete(payload.id);
      return { success: true, message: 'Profile deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting profile:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Profile deletion failed',
      });
    }
  }

  /**
   * List all profiles (paginated)
   * Pattern: 'user.profile.findAll'
   */
  @MessagePattern('user.profile.findAll')
  async findAll(payload: { page?: number; limit?: number }) {
    this.logger.log('Received user.profile.findAll message:', payload);

    try {
      return await this.profileService.findAll(payload.page, payload.limit);
    } catch (error) {
      this.logger.error('Error listing profiles:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to list profiles',
      });
    }
  }
}
