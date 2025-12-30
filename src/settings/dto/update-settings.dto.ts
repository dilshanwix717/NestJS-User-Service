// FILE: apps/user-service/src/settings/dto/update-settings.dto.ts
import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  theme?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;

  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  videoQuality?: string;

  @IsOptional()
  @IsBoolean()
  subtitlesEnabled?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  subtitlesLanguage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  maturityRating?: string;

  @IsOptional()
  @IsBoolean()
  dataSaverMode?: boolean;

  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(300)
  sessionTimeout?: number;

  @IsOptional()
  @IsBoolean()
  privacyShowProfile?: boolean;

  @IsOptional()
  @IsBoolean()
  privacyShowActivity?: boolean;

  @IsOptional()
  @IsBoolean()
  privacyAllowMessages?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;
}
