// FILE: apps/user-service/src/common/interfaces/user-status.interface.ts
export interface IUserStatus {
  id: string;
  userProfileId: string;
  status: string;
  reason: string | null;
  reasonDetail: string | null;
  actionedBy: string | null;
  actionedAt: Date | null;
  expiresAt: Date | null;
  notes: string | null;
  canLogin: boolean;
  canStream: boolean;
  canComment: boolean;
  canUpload: boolean;
  canMessage: boolean;
  canPurchase: boolean;
  requiresKyc: boolean;
  isVerified: boolean;
  isModerator: boolean;
  isContentCreator: boolean;
  isPremiumSupporter: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
  version: number;
}
