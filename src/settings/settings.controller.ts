// FILE: apps/user-service/src/settings/settings.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { SettingsService } from './settings.service';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller()
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);

  constructor(private readonly settingsService: SettingsService) {}

  /**
   * Create user settings
   * Pattern: 'user.settings.create'
   */
  @MessagePattern('user.settings.create')
  async create(payload: { userProfileId: string; dto: CreateSettingsDto }) {
    this.logger.log(
      'Received user.settings.create message:',
      payload.userProfileId,
    );

    try {
      return await this.settingsService.create(
        payload.userProfileId,
        payload.dto,
      );
    } catch (error) {
      this.logger.error('Error creating settings:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Settings creation failed',
      });
    }
  }

  /**
   * Get settings by userProfileId
   * Pattern: 'user.settings.findByUserProfileId'
   */
  @MessagePattern('user.settings.findByUserProfileId')
  async findByUserProfileId(payload: { userProfileId: string }) {
    this.logger.log(
      'Received user.settings.findByUserProfileId message:',
      payload.userProfileId,
    );

    try {
      return await this.settingsService.findByUserProfileId(
        payload.userProfileId,
      );
    } catch (error) {
      this.logger.error('Error finding settings:', error);
      throw new RpcException({
        status: 'error',
        message: error instanceof Error ? error.message : 'Settings not found',
      });
    }
  }

  /**
   * Get settings by ID
   * Pattern: 'user.settings.findById'
   */
  @MessagePattern('user.settings.findById')
  async findById(payload: { id: string }) {
    this.logger.log('Received user.settings.findById message:', payload.id);

    try {
      return await this.settingsService.findById(payload.id);
    } catch (error) {
      this.logger.error('Error finding settings:', error);
      throw new RpcException({
        status: 'error',
        message: error instanceof Error ? error.message : 'Settings not found',
      });
    }
  }

  /**
   * Update settings
   * Pattern: 'user.settings.update'
   */
  @MessagePattern('user.settings.update')
  async update(payload: { id: string; dto: UpdateSettingsDto }) {
    this.logger.log('Received user.settings.update message:', payload.id);

    try {
      return await this.settingsService.update(payload.id, payload.dto);
    } catch (error) {
      this.logger.error('Error updating settings:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Settings update failed',
      });
    }
  }

  /**
   * Soft delete settings
   * Pattern: 'user.settings.delete'
   */
  @MessagePattern('user.settings.delete')
  async delete(payload: { id: string }) {
    this.logger.log('Received user.settings.delete message:', payload.id);

    try {
      await this.settingsService.softDelete(payload.id);
      return { success: true, message: 'Settings deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting settings:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Settings deletion failed',
      });
    }
  }

  /**
   * Reset settings to defaults
   * Pattern: 'user.settings.reset'
   */
  @MessagePattern('user.settings.reset')
  async reset(payload: { id: string }) {
    this.logger.log('Received user.settings.reset message:', payload.id);

    try {
      return await this.settingsService.resetToDefaults(payload.id);
    } catch (error) {
      this.logger.error('Error resetting settings:', error);
      throw new RpcException({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Settings reset failed',
      });
    }
  }
}
