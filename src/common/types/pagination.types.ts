// FILE: apps/user-service/src/common/types/pagination.types.ts
/**
 * Pagination request type
 */
export interface PaginationRequest {
  page?: number;
  limit?: number;
}

/**
 * Pagination response type
 */
export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Helper function to create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResponse<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
