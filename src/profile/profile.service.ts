// FILE: apps/user-service/src/profile/profile.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { IUserProfile } from '../common/interfaces/user-profile.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user profile
   * Links to Auth Service via authUserId
   */
  async create(dto: CreateProfileDto): Promise<IUserProfile> {
    this.logger.log(`Creating profile for authUserId: ${dto.authUserId}`);

    try {
      // Check if profile already exists for this authUserId
      const existingProfile = await this.prisma.userProfile.findUnique({
        where: { authUserId: dto.authUserId },
      });

      if (existingProfile && !existingProfile.isDeleted) {
        throw new ConflictException(
          `Profile already exists for authUserId: ${dto.authUserId}`,
        );
      }

      // If soft-deleted profile exists, restore it instead of creating new one
      if (existingProfile && existingProfile.isDeleted) {
        this.logger.log(
          `Restoring soft-deleted profile: ${existingProfile.id}`,
        );
        return (await this.prisma.userProfile.update({
          where: { id: existingProfile.id },
          data: {
            ...dto,
            isDeleted: false,
            deletedAt: null,
            version: { increment: 1 },
          },
        })) as IUserProfile;
      }

      // Create new profile
      const profile = await this.prisma.userProfile.create({
        data: {
          authUserId: dto.authUserId,
          displayName: dto.displayName,
          firstName: dto.firstName,
          lastName: dto.lastName,
          avatar: dto.avatar,
          bio: dto.bio,
          country: dto.country,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
          phone: dto.phone,
        },
      });

      this.logger.log(`Profile created successfully: ${profile.id}`);
      return profile as IUserProfile;
    } catch (error) {
      this.logger.error('Error creating profile:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create profile');
    }
  }

  /**
   * Find profile by ID
   */
  async findById(id: string): Promise<IUserProfile> {
    this.logger.log(`Finding profile by id: ${id}`);

    const profile = await this.prisma.userProfile.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found: ${id}`);
    }

    return profile as IUserProfile;
  }

  /**
   * Find profile by authUserId
   */
  async findByAuthUserId(authUserId: string): Promise<IUserProfile> {
    this.logger.log(`Finding profile by authUserId: ${authUserId}`);

    const profile = await this.prisma.userProfile.findFirst({
      where: {
        authUserId,
        isDeleted: false,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile not found for authUserId: ${authUserId}`,
      );
    }

    return profile as IUserProfile;
  }

  /**
   * Find profile with all related data
   */
  async findByIdWithRelations(id: string): Promise<IUserProfile> {
    this.logger.log(`Finding profile with relations by id: ${id}`);

    const profile = await this.prisma.userProfile.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        settings: {
          where: { isDeleted: false },
        },
        subscriptions: {
          where: { isDeleted: false },
        },
        status: {
          where: { isDeleted: false },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found: ${id}`);
    }

    return profile as unknown as IUserProfile;
  }

  /**
   * Update profile with optimistic locking
   */
  async update(id: string, dto: UpdateProfileDto): Promise<IUserProfile> {
    this.logger.log(`Updating profile: ${id}`);

    // Check if profile exists
    const existingProfile = await this.findById(id);

    // Optimistic locking check
    if (dto.version && existingProfile.version !== dto.version) {
      throw new ConflictException(
        'Profile has been modified by another process. Please refresh and try again.',
      );
    }

    try {
      const updated = await this.prisma.userProfile.update({
        where: { id },
        data: {
          displayName: dto.displayName,
          firstName: dto.firstName,
          lastName: dto.lastName,
          avatar: dto.avatar,
          bio: dto.bio,
          country: dto.country,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          phone: dto.phone,
          version: { increment: 1 },
        },
      });

      this.logger.log(`Profile updated successfully: ${id}`);
      return updated as IUserProfile;
    } catch (error) {
      this.logger.error('Error updating profile:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Profile not found: ${id}`);
      }
      throw new BadRequestException('Failed to update profile');
    }
  }

  /**
   * Soft delete profile
   */
  async softDelete(id: string): Promise<void> {
    this.logger.log(`Soft deleting profile: ${id}`);

    // Check if profile exists
    await this.findById(id);

    try {
      await this.prisma.userProfile.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          version: { increment: 1 },
        },
      });

      this.logger.log(`Profile soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error('Error soft deleting profile:', error);
      throw new BadRequestException('Failed to delete profile');
    }
  }

  /**
   * List all profiles (admin function)
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ profiles: IUserProfile[]; total: number; page: number }> {
    this.logger.log(`Listing profiles - page: ${page}, limit: ${limit}`);

    const skip = (page - 1) * limit;

    const [profiles, total] = await Promise.all([
      this.prisma.userProfile.findMany({
        where: { isDeleted: false },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userProfile.count({
        where: { isDeleted: false },
      }),
    ]);

    return {
      profiles: profiles as IUserProfile[],
      total,
      page,
    };
  }

  /**
   * Check if authUserId exists in Auth Service
   * This should call Auth Service via RPC in production
   */
  validateAuthUser(authUserId: string): Promise<boolean> {
    // TODO: Implement RPC call to Auth Service
    // Example:
    // const result = await this.authServiceClient.send('validate-user', { userId: authUserId }).toPromise();
    // return result.valid;

    this.logger.warn(
      `Auth validation not implemented. Assuming authUserId is valid: ${authUserId}`,
    );
    return Promise.resolve(true);
  }
}
