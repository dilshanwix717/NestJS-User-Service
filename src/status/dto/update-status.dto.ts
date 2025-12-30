// FILE: apps/user-service/src/status/dto/update-status.dto.ts
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

export class UpdateStatusDto {
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

  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;
}
