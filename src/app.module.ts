import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import redisConfig from './config/redis.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config'; // 导入 jwtConfig

import { UserModule } from './modules/user/user.module';
import { EmailModule } from './modules/email/email.module';
import { LoginModule } from './modules/login/login.module';
import { Redis } from 'ioredis';

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
  ],
  controllers: [],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis => {
        const client = redisConfig(configService);
        return client;
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
