import * as dotenv from 'dotenv';
dotenv.config(); // 加载 .env 文件

declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './swagger'; // 引入 Swagger 配置
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // 导入 NestExpressApplication
import redisConfig from './config/redis.config';
import { Redis } from 'ioredis';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  // 获取 ConfigService 实例
  const configService = new ConfigService();
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    // // eslint-disable-next-line @typescript-eslint/no-require-imports
    // const path = require('path');
    // console.log(path.join(__dirname, '../public'));

    // bootstrap 函数中设置静态资源路径
    // console.log(join(__dirname, '../public')); // 应该输出 public 目录的绝对路径
    app.useStaticAssets(join(__dirname, '..', 'public'));

    // 启用 CORS
    app.enableCors({
      origin: 'http://localhost:3000', // 允许的域名
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的 HTTP 方法
      credentials: true, // 允许发送 cookies
    });
    // 设置 Swagger
    setupSwagger(app, configService); // 将 configService 传递给 Swagger 配置
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

    const port = configService.get('PORT'); // 从 configService 获取端口
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  } catch (error) {
    Logger.error(error);
  }

  const redisClient: Redis = redisConfig(configService);

  // 处理关闭事件
  process.on('SIGINT', async () => {
    await redisClient.quit(); // 关闭 Redis 客户端连接
    process.exit(0);
  });
}
bootstrap();
