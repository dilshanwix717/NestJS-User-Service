// FILE: apps/user-service/src/subscription/dto/create-subscription.dto.ts
import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
  IsNotEmpty,
  IsUUID,
  IsJSON,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsUUID()
  userProfileId!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  planType!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  billingCycle?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsDateString()
  renewalDate?: string;

  @IsOptional()
  @IsDateString()
  trialEndsAt?: string;

  @IsOptional()
  @IsBoolean()
  isAutoRenew?: boolean;

  @IsOptional()
  @IsBoolean()
  isTrial?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxDevices?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxProfiles?: number;

  @IsOptional()
  @IsBoolean()
  canDownload?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  videoQuality?: string;

  @IsOptional()
  @IsBoolean()
  adsEnabled?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  externalSubscriptionId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  paymentMethod?: string;

  @IsOptional()
  @IsJSON()
  metadata?: string;
}
