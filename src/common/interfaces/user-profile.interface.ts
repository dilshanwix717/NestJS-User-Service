// FILE: apps/user-service/src/common/interfaces/user-profile.interface.ts
export interface IUserProfile {
  id: string;
  authUserId: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  bio: string | null;
  country: string | null;
  dateOfBirth: Date | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
  version: number;
}
