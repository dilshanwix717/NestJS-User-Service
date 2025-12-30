// FILE: apps/user-service/src/status/dto/create-status.dto.ts
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  MaxLength,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateStatusDto {
  @IsNotEmpty()
  @IsUUID()
  userProfileId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reasonDetail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  actionedBy?: string;

  @IsOptional()
  @IsDateString()
  actionedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  canLogin?: boolean;

  @IsOptional()
  @IsBoolean()
  canStream?: boolean;

  @IsOptional()
  @IsBoolean()
  canComment?: boolean;

  @IsOptional()
  @IsBoolean()
  canUpload?: boolean;

  @IsOptional()
  @IsBoolean()
  canMessage?: boolean;

  @IsOptional()
  @IsBoolean()
  canPurchase?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresKyc?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isModerator?: boolean;

  @IsOptional()
  @IsBoolean()
  isContentCreator?: boolean;

  @IsOptional()
  @IsBoolean()
  isPremiumSupporter?: boolean;
}
