// FILE: apps/user-service/src/common/interfaces/user-settings.interface.ts
export interface IUserSettings {
  id: string;
  userProfileId: string;
  language: string;
  theme: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  autoplay: boolean;
  videoQuality: string;
  subtitlesEnabled: boolean;
  subtitlesLanguage: string;
  maturityRating: string;
  dataSaverMode: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  privacyShowProfile: boolean;
  privacyShowActivity: boolean;
  privacyAllowMessages: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
  version: number;
}
