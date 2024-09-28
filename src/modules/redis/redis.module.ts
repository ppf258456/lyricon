import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisConfig from '../../config/redis.config'; // 引入 redisConfig
import { Redis } from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis =>
        redisConfig(configService), // 使用 redisConfig 函数
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'], // 导出 REDIS_CLIENT 供其他模块使用
})
export class RedisModule {}
