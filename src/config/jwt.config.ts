// src/config/jwt.config.ts
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const secret = configService.get<string>('JWT_SECRET');
  if (!secret) {
    console.error('JWT_SECRET 环境变量不存在.');
  }
  return {
    secret: secret || 'defaultSecret', // 使用环境变量或默认值
    signOptions: {
      expiresIn: '1h', // 过期时间
    },
  };
};
