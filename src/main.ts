import * as dotenv from 'dotenv';
dotenv.config(); // 加载 .env 文件

declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import redisConfig from './config/redis.config';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    // 使用全局 ValidationPipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // 自动移除 DTO 中未定义的属性
        forbidNonWhitelisted: true, // 如果传入未在 DTO 中定义的属性，抛出错误
        transform: true, // 自动类型转换
        exceptionFactory: (errors) => {
          const messages = errors.map(
            (error) =>
              `${error.property} - ${Object.values(error.constraints).join(', ')}`,
          );
          return new BadRequestException(messages);
        },
      }),
    );
    const logger = new Logger('Bootstrap');
    const jwtService = app.get(JwtService); // 获取 JwtService 实例
    app.use((req, res, next) =>
      new JwtMiddleware(jwtService).use(req, res, next),
    ); // 作为中间件使用

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  } catch (error) {
    Logger.error(error);
  }
  const configService = new ConfigService(); // 需要初始化 ConfigService
  const redisClient: Redis = redisConfig(configService);

  // 处理关闭事件
  process.on('SIGINT', async () => {
    await redisClient.quit(); // 关闭 Redis 客户端连接
    process.exit(0);
  });
}
bootstrap();
