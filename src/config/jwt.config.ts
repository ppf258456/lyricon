// src/config/jwt.config.ts
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET') || 'defaultSecret', // 使用环境变量或默认值
  signOptions: {
    expiresIn: '1h', // 过期时间
  },
});
