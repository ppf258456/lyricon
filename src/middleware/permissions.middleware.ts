import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user; // 假设用户信息已通过 JWT 中间件注入
    console.log(user);

    if (!user) {
      throw new ForbiddenException('未授权');
    }

    req.user.role = user.role; // 将角色信息存入请求对象
    next();
  }
}
