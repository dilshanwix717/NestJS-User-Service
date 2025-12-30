// FILE: apps/user-service/src/settings/settings.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { IUserSettings } from '../common/interfaces/user-settings.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create user settings
   * One-to-one relationship with UserProfile
   */
  async create(
    userProfileId: string,
    dto: CreateSettingsDto,
  ): Promise<IUserSettings> {
    this.logger.log(`Creating settings for userProfileId: ${userProfileId}`);

    try {
      // Check if profile exists
      const profile = await this.prisma.userProfile.findFirst({
        where: { id: userProfileId, isDeleted: false },
      });

      if (!profile) {
        throw new NotFoundException(`Profile not found: ${userProfileId}`);
      }

      // Check if settings already exist
      const existingSettings = await this.prisma.userSettings.findUnique({
        where: { userProfileId },
      });

      if (existingSettings && !existingSettings.isDeleted) {
        throw new ConflictException(
          `Settings already exist for profile: ${userProfileId}`,
        );
      }

      // If soft-deleted settings exist, restore them
      if (existingSettings && existingSettings.isDeleted) {
        this.logger.log(
          `Restoring soft-deleted settings: ${existingSettings.id}`,
        );
        return (await this.prisma.userSettings.update({
          where: { id: existingSettings.id },
          data: {
            ...dto,
            isDeleted: false,
            deletedAt: null,
            version: { increment: 1 },
          },
        })) as IUserSettings;
      }

      // Create new settings with defaults
      const settings = await this.prisma.userSettings.create({
        data: {
          userProfileId,
          language: dto.language,
          theme: dto.theme,
          timezone: dto.timezone,
          emailNotifications: dto.emailNotifications,
          pushNotifications: dto.pushNotifications,
          smsNotifications: dto.smsNotifications,
          marketingEmails: dto.marketingEmails,
          autoplay: dto.autoplay,
          videoQuality: dto.videoQuality,
          subtitlesEnabled: dto.subtitlesEnabled,
          subtitlesLanguage: dto.subtitlesLanguage,
          maturityRating: dto.maturityRating,
          dataSaverMode: dto.dataSaverMode,
          twoFactorEnabled: dto.twoFactorEnabled,
          sessionTimeout: dto.sessionTimeout,
          privacyShowProfile: dto.privacyShowProfile,
          privacyShowActivity: dto.privacyShowActivity,
          privacyAllowMessages: dto.privacyAllowMessages,
        },
      });

      this.logger.log(`Settings created successfully: ${settings.id}`);
      return settings as IUserSettings;
    } catch (error) {
      this.logger.error('Error creating settings:', error);
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create settings');
    }
  }

  /**
   * Find settings by userProfileId
   */
  async findByUserProfileId(userProfileId: string): Promise<IUserSettings> {
    this.logger.log(`Finding settings by userProfileId: ${userProfileId}`);

    const settings = await this.prisma.userSettings.findFirst({
      where: {
        userProfileId,
        isDeleted: false,
      },
    });

    if (!settings) {
      throw new NotFoundException(
        `Settings not found for profile: ${userProfileId}`,
      );
    }

    return settings as IUserSettings;
  }

  /**
   * Find settings by ID
   */
  async findById(id: string): Promise<IUserSettings> {
    this.logger.log(`Finding settings by id: ${id}`);

    const settings = await this.prisma.userSettings.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!settings) {
      throw new NotFoundException(`Settings not found: ${id}`);
    }

    return settings as IUserSettings;
  }

  /**
   * Update settings with optimistic locking
   */
  async update(id: string, dto: UpdateSettingsDto): Promise<IUserSettings> {
    this.logger.log(`Updating settings: ${id}`);

    // Check if settings exist
    const existingSettings = await this.findById(id);

    // Optimistic locking check
    if (dto.version && existingSettings.version !== dto.version) {
      throw new ConflictException(
        'Settings have been modified by another process. Please refresh and try again.',
      );
    }

    try {
      const updated = await this.prisma.userSettings.update({
        where: { id },
        data: {
          language: dto.language,
          theme: dto.theme,
          timezone: dto.timezone,
          emailNotifications: dto.emailNotifications,
          pushNotifications: dto.pushNotifications,
          smsNotifications: dto.smsNotifications,
          marketingEmails: dto.marketingEmails,
          autoplay: dto.autoplay,
          videoQuality: dto.videoQuality,
          subtitlesEnabled: dto.subtitlesEnabled,
          subtitlesLanguage: dto.subtitlesLanguage,
          maturityRating: dto.maturityRating,
          dataSaverMode: dto.dataSaverMode,
          twoFactorEnabled: dto.twoFactorEnabled,
          sessionTimeout: dto.sessionTimeout,
          privacyShowProfile: dto.privacyShowProfile,
          privacyShowActivity: dto.privacyShowActivity,
          privacyAllowMessages: dto.privacyAllowMessages,
          version: { increment: 1 },
        },
      });

      this.logger.log(`Settings updated successfully: ${id}`);
      return updated as IUserSettings;
    } catch (error) {
      this.logger.error('Error updating settings:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Settings not found: ${id}`);
      }
      throw new BadRequestException('Failed to update settings');
    }
  }

  /**
   * Soft delete settings
   */
  async softDelete(id: string): Promise<void> {
    this.logger.log(`Soft deleting settings: ${id}`);

    // Check if settings exist
    await this.findById(id);

    try {
      await this.prisma.userSettings.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          version: { increment: 1 },
        },
      });

      this.logger.log(`Settings soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error('Error soft deleting settings:', error);
      throw new BadRequestException('Failed to delete settings');
    }
  }

  /**
   * Reset settings to defaults
   */
  async resetToDefaults(id: string): Promise<IUserSettings> {
    this.logger.log(`Resetting settings to defaults: ${id}`);

    // Check if settings exist
    await this.findById(id);

    try {
      const updated = await this.prisma.userSettings.update({
        where: { id },
        data: {
          language: 'en',
          theme: 'light',
          timezone: 'UTC',
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          autoplay: true,
          videoQuality: 'auto',
          subtitlesEnabled: false,
          subtitlesLanguage: 'en',
          maturityRating: 'PG-13',
          dataSaverMode: false,
          twoFactorEnabled: false,
          sessionTimeout: 3600,
          privacyShowProfile: true,
          privacyShowActivity: false,
          privacyAllowMessages: true,
          version: { increment: 1 },
        },
      });

      this.logger.log(`Settings reset to defaults successfully: ${id}`);
      return updated as IUserSettings;
    } catch (error) {
      this.logger.error('Error resetting settings:', error);
      throw new BadRequestException('Failed to reset settings');
    }
  }
}
