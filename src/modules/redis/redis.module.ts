import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisConfig from '../../config/redis.config';
import { Redis } from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (() => {
        let redisClient: Redis | null = null; // 使用闭包来保存 Redis 客户端实例

        return (configService: ConfigService): Redis => {
          if (!redisClient) {
            console.log('Initializing Redis Client...'); // 添加日志
            redisClient = redisConfig(configService); // 初始化 Redis 客户端
          }
          return redisClient; // 返回已有的 Redis 客户端实例
        };
      })(),
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
