import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1]; // 从请求头中获取 token
    if (!token) {
      throw new UnauthorizedException('没有提供 token');
    }

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded; // 将解码后的用户信息添加到请求中
      next();
    } catch (error) {
      throw new UnauthorizedException('无效的 token', error);
    }
  }
}
