// FILE: apps/user-service/src/status/status.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { IUserStatus } from '../common/interfaces/user-status.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class StatusService {
  private readonly logger = new Logger(StatusService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create user status
   * One-to-one relationship with UserProfile
   */
  async create(dto: CreateStatusDto): Promise<IUserStatus> {
    this.logger.log(`Creating status for userProfileId: ${dto.userProfileId}`);

    try {
      // Check if profile exists
      const profile = await this.prisma.userProfile.findFirst({
        where: { id: dto.userProfileId, isDeleted: false },
      });

      if (!profile) {
        throw new NotFoundException(`Profile not found: ${dto.userProfileId}`);
      }

      // Check if status already exists
      const existingStatus = await this.prisma.userStatus.findUnique({
        where: { userProfileId: dto.userProfileId },
      });

      if (existingStatus && !existingStatus.isDeleted) {
        throw new ConflictException(
          `Status already exists for profile: ${dto.userProfileId}`,
        );
      }

      // If soft-deleted status exists, restore it
      if (existingStatus && existingStatus.isDeleted) {
        this.logger.log(`Restoring soft-deleted status: ${existingStatus.id}`);
        return (await this.prisma.userStatus.update({
          where: { id: existingStatus.id },
          data: {
            ...dto,
            isDeleted: false,
            deletedAt: null,
            actionedAt: dto.actionedAt ? new Date(dto.actionedAt) : null,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
            version: { increment: 1 },
          },
        })) as IUserStatus;
      }

      // Create new status
      const status = await this.prisma.userStatus.create({
        data: {
          userProfileId: dto.userProfileId,
          status: dto.status || 'active',
          reason: dto.reason,
          reasonDetail: dto.reasonDetail,
          actionedBy: dto.actionedBy,
          actionedAt: dto.actionedAt ? new Date(dto.actionedAt) : null,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          notes: dto.notes,
          canLogin: dto.canLogin ?? true,
          canStream: dto.canStream ?? true,
          canComment: dto.canComment ?? true,
          canUpload: dto.canUpload ?? false,
          canMessage: dto.canMessage ?? true,
          canPurchase: dto.canPurchase ?? true,
          requiresKyc: dto.requiresKyc ?? false,
          isVerified: dto.isVerified ?? false,
          isModerator: dto.isModerator ?? false,
          isContentCreator: dto.isContentCreator ?? false,
          isPremiumSupporter: dto.isPremiumSupporter ?? false,
        },
      });

      this.logger.log(`Status created successfully: ${status.id}`);
      return status as IUserStatus;
    } catch (error) {
      this.logger.error('Error creating status:', error);
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create status');
    }
  }

  /**
   * Find status by userProfileId
   */
  async findByUserProfileId(userProfileId: string): Promise<IUserStatus> {
    this.logger.log(`Finding status by userProfileId: ${userProfileId}`);

    const status = await this.prisma.userStatus.findFirst({
      where: {
        userProfileId,
        isDeleted: false,
      },
    });

    if (!status) {
      throw new NotFoundException(
        `Status not found for profile: ${userProfileId}`,
      );
    }

    return status as IUserStatus;
  }

  /**
   * Find status by ID
   */
  async findById(id: string): Promise<IUserStatus> {
    this.logger.log(`Finding status by id: ${id}`);

    const status = await this.prisma.userStatus.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!status) {
      throw new NotFoundException(`Status not found: ${id}`);
    }

    return status as IUserStatus;
  }

  /**
   * Update status with optimistic locking
   */
  async update(id: string, dto: UpdateStatusDto): Promise<IUserStatus> {
    this.logger.log(`Updating status: ${id}`);

    // Check if status exists
    const existingStatus = await this.findById(id);

    // Optimistic locking check
    if (dto.version && existingStatus.version !== dto.version) {
      throw new ConflictException(
        'Status has been modified by another process. Please refresh and try again.',
      );
    }

    try {
      const updated = await this.prisma.userStatus.update({
        where: { id },
        data: {
          status: dto.status,
          reason: dto.reason,
          reasonDetail: dto.reasonDetail,
          actionedBy: dto.actionedBy,
          actionedAt: dto.actionedAt ? new Date(dto.actionedAt) : undefined,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
          notes: dto.notes,
          canLogin: dto.canLogin,
          canStream: dto.canStream,
          canComment: dto.canComment,
          canUpload: dto.canUpload,
          canMessage: dto.canMessage,
          canPurchase: dto.canPurchase,
          requiresKyc: dto.requiresKyc,
          isVerified: dto.isVerified,
          isModerator: dto.isModerator,
          isContentCreator: dto.isContentCreator,
          isPremiumSupporter: dto.isPremiumSupporter,
          version: { increment: 1 },
        },
      });

      this.logger.log(`Status updated successfully: ${id}`);
      return updated as IUserStatus;
    } catch (error) {
      this.logger.error('Error updating status:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Status not found: ${id}`);
      }
      throw new BadRequestException('Failed to update status');
    }
  }

  /**
   * Suspend user account
   */
  async suspendUser(
    id: string,
    reason: string,
    actionedBy: string,
    expiresAt?: Date,
  ): Promise<IUserStatus> {
    this.logger.log(`Suspending user status: ${id}`);

    try {
      const updated = await this.prisma.userStatus.update({
        where: { id },
        data: {
          status: 'suspended',
          reason,
          actionedBy,
          actionedAt: new Date(),
          expiresAt,
          canLogin: false,
          canStream: false,
          version: { increment: 1 },
        },
      });

      this.logger.log(`User suspended successfully: ${id}`);
      return updated as IUserStatus;
    } catch (error) {
      this.logger.error('Error suspending user:', error);
      throw new BadRequestException('Failed to suspend user');
    }
  }

  /**
   * Ban user account
   */
  async banUser(
    id: string,
    reason: string,
    actionedBy: string,
  ): Promise<IUserStatus> {
    this.logger.log(`Banning user status: ${id}`);

    try {
      const updated = await this.prisma.userStatus.update({
        where: { id },
        data: {
          status: 'banned',
          reason,
          actionedBy,
          actionedAt: new Date(),
          canLogin: false,
          canStream: false,
          canComment: false,
          canMessage: false,
          canPurchase: false,
          version: { increment: 1 },
        },
      });

      this.logger.log(`User banned successfully: ${id}`);
      return updated as IUserStatus;
    } catch (error) {
      this.logger.error('Error banning user:', error);
      throw new BadRequestException('Failed to ban user');
    }
  }

  /**
   * Activate user account
   */
  async activateUser(id: string): Promise<IUserStatus> {
    this.logger.log(`Activating user status: ${id}`);

    try {
      const updated = await this.prisma.userStatus.update({
        where: { id },
        data: {
          status: 'active',
          reason: null,
          reasonDetail: null,
          expiresAt: null,
          canLogin: true,
          canStream: true,
          canComment: true,
          canMessage: true,
          canPurchase: true,
          version: { increment: 1 },
        },
      });

      this.logger.log(`User activated successfully: ${id}`);
      return updated as IUserStatus;
    } catch (error) {
      this.logger.error('Error activating user:', error);
      throw new BadRequestException('Failed to activate user');
    }
  }

  /**
   * Soft delete status
   */
  async softDelete(id: string): Promise<void> {
    this.logger.log(`Soft deleting status: ${id}`);

    // Check if status exists
    await this.findById(id);

    try {
      await this.prisma.userStatus.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          version: { increment: 1 },
        },
      });

      this.logger.log(`Status soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error('Error soft deleting status:', error);
      throw new BadRequestException('Failed to delete status');
    }
  }

  /**
   * Find all suspended users
   */
  async findAllSuspended(): Promise<IUserStatus[]> {
    this.logger.log('Finding all suspended users');

    const statuses = await this.prisma.userStatus.findMany({
      where: {
        status: 'suspended',
        isDeleted: false,
      },
      orderBy: { actionedAt: 'desc' },
    });

    return statuses as IUserStatus[];
  }

  /**
   * Find all banned users
   */
  async findAllBanned(): Promise<IUserStatus[]> {
    this.logger.log('Finding all banned users');

    const statuses = await this.prisma.userStatus.findMany({
      where: {
        status: 'banned',
        isDeleted: false,
      },
      orderBy: { actionedAt: 'desc' },
    });

    return statuses as IUserStatus[];
  }
}
