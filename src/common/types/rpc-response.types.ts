// FILE: apps/user-service/src/common/types/rpc-response.types.ts
/**
 * Standard RPC success response
 */
export interface RpcSuccessResponse<T = unknown> {
  status: 'success';
  data: T;
  timestamp?: string;
}

/**
 * Standard RPC error response
 */
export interface RpcErrorResponse {
  status: 'error';
  code?: string;
  message: string;
  timestamp?: string;
}

/**
 * Helper function to create success response
 */
export function createSuccessResponse<T>(data: T): RpcSuccessResponse<T> {
  return {
    status: 'success',
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Helper function to create error response
 */
export function createErrorResponse(
  message: string,
  code?: string,
): RpcErrorResponse {
  return {
    status: 'error',
    code,
    message,
    timestamp: new Date().toISOString(),
  };
}
