// FILE: apps/user-service/src/common/exceptions/user.exceptions.ts
import { RpcException } from '@nestjs/microservices';

/**
 * Custom exception for profile-related errors
 */
export class ProfileNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      status: 'error',
      code: 'PROFILE_NOT_FOUND',
      message: `Profile not found: ${id}`,
    });
  }
}

/**
 * Custom exception for settings-related errors
 */
export class SettingsNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      status: 'error',
      code: 'SETTINGS_NOT_FOUND',
      message: `Settings not found: ${id}`,
    });
  }
}

/**
 * Custom exception for subscription-related errors
 */
export class SubscriptionNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      status: 'error',
      code: 'SUBSCRIPTION_NOT_FOUND',
      message: `Subscription not found: ${id}`,
    });
  }
}

/**
 * Custom exception for status-related errors
 */
export class StatusNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      status: 'error',
      code: 'STATUS_NOT_FOUND',
      message: `Status not found: ${id}`,
    });
  }
}

/**
 * Custom exception for version conflicts (optimistic locking)
 */
export class VersionConflictException extends RpcException {
  constructor(resource: string) {
    super({
      status: 'error',
      code: 'VERSION_CONFLICT',
      message: `${resource} has been modified. Please refresh and try again.`,
    });
  }
}
