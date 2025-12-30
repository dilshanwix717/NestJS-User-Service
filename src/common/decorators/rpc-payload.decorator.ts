// FILE: apps/user-service/src/common/decorators/rpc-payload.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract payload from RPC context
 * Usage: @RpcPayload() dto: CreateProfileDto
 */
export const RpcPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const rpcContext = ctx.switchToRpc();
    return rpcContext.getData();
  },
);
