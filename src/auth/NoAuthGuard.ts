import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class NoAuthGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(context: ExecutionContext): boolean {
    return true; // 允许所有请求通过
  }
}
