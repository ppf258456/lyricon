// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    JwtModule.register({}), // 注册 JwtModule
    TypeOrmModule.forFeature([User]),
    RedisModule, // 导入 RedisModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 导出 UserService 以供其他模块使用
})
export class UserModule {}
