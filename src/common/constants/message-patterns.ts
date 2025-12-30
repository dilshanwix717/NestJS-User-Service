// FILE: apps/user-service/src/common/constants/message-patterns.ts
/**
 * Centralized message patterns for RPC communication
 * Helps maintain consistency and avoid typos
 */
export const USER_PATTERNS = {
  // Profile patterns
  PROFILE: {
    CREATE: 'user.profile.create',
    FIND_BY_ID: 'user.profile.findById',
    FIND_BY_AUTH_USER_ID: 'user.profile.findByAuthUserId',
    FIND_BY_ID_WITH_RELATIONS: 'user.profile.findByIdWithRelations',
    UPDATE: 'user.profile.update',
    DELETE: 'user.profile.delete',
    FIND_ALL: 'user.profile.findAll',
  },

  // Settings patterns
  SETTINGS: {
    CREATE: 'user.settings.create',
    FIND_BY_ID: 'user.settings.findById',
    FIND_BY_USER_PROFILE_ID: 'user.settings.findByUserProfileId',
    UPDATE: 'user.settings.update',
    DELETE: 'user.settings.delete',
    RESET: 'user.settings.reset',
  },

  // Subscription patterns
  SUBSCRIPTION: {
    CREATE: 'user.subscription.create',
    FIND_BY_ID: 'user.subscription.findById',
    FIND_ACTIVE_BY_USER_PROFILE_ID:
      'user.subscription.findActiveByUserProfileId',
    FIND_ALL_BY_USER_PROFILE_ID: 'user.subscription.findAllByUserProfileId',
    UPDATE: 'user.subscription.update',
    DELETE: 'user.subscription.delete',
    CANCEL: 'user.subscription.cancel',
    SUSPEND: 'user.subscription.suspend',
    ACTIVATE: 'user.subscription.activate',
    CHECK_EXPIRATION: 'user.subscription.checkExpiration',
    FIND_EXPIRING_SOON: 'user.subscription.findExpiringSoon',
  },

  // Status patterns
  STATUS: {
    CREATE: 'user.status.create',
    FIND_BY_ID: 'user.status.findById',
    FIND_BY_USER_PROFILE_ID: 'user.status.findByUserProfileId',
    UPDATE: 'user.status.update',
    DELETE: 'user.status.delete',
    SUSPEND: 'user.status.suspend',
    BAN: 'user.status.ban',
    ACTIVATE: 'user.status.activate',
    FIND_ALL_SUSPENDED: 'user.status.findAllSuspended',
    FIND_ALL_BANNED: 'user.status.findAllBanned',
  },
} as const;
