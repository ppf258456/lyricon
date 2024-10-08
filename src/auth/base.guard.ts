import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { Inject } from '@nestjs/common';

@Injectable()
export class BaseGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') protected readonly redis: Redis,
  ) {}

  async validateToken(token: string): Promise<any> {
    const payload = await this.jwtService.verifyAsync(token);
    const redisToken = await this.redis.get(`token:${payload.id}`);
    if (!redisToken || redisToken !== token) {
      throw new ForbiddenException('无效的认证信息');
    }
    return payload;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('未提供认证信息');
    }

    const token = authHeader.split(' ')[1]; // 提取 Bearer Token
    await this.validateToken(token);
    request.user = await this.validateToken(token);
    return true;
  }
}
