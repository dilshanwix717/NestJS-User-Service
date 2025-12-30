// FILE: apps/user-service/src/common/interfaces/subscription.interface.ts
export interface ISubscription {
  id: string;
  userProfileId: string;
  planType: string;
  status: string;
  billingCycle: string | null;
  startDate: Date;
  endDate: Date | null;
  renewalDate: Date | null;
  canceledAt: Date | null;
  suspendedAt: Date | null;
  trialEndsAt: Date | null;
  isAutoRenew: boolean;
  isTrial: boolean;
  maxDevices: number;
  maxProfiles: number;
  canDownload: boolean;
  videoQuality: string;
  adsEnabled: boolean;
  externalSubscriptionId: string | null;
  paymentMethod: string | null;
  metadata: unknown | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
  version: number;
}
