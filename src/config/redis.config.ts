import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export default function redisConfig(configService: ConfigService): Redis {
  const redisClient = new Redis({
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT'),
  });

  redisClient.on('error', (error) =>
    console.error('Redis Client Error', error),
  );
  redisClient.on('connect', () => console.log('Redis Client Connected'));

  return redisClient; // 确保返回 Redis 客户端实例
}
