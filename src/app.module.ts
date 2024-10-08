import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config';

import { UserModule } from './modules/user/user.module';
import { EmailModule } from './modules/email/email.module';
import { LoginModule } from './modules/login/login.module';
import { RedisModule } from './modules/redis/redis.module'; // 确保路径正确
import { CategoryModule } from './modules/category/category.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => jwtConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormConfig(configService),
      inject: [ConfigService],
    }),
    UserModule,
    EmailModule,
    LoginModule,
    RedisModule, // 只在这里导入 RedisModule
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
