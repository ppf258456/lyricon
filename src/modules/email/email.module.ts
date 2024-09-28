import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { RedisModule } from '../redis/redis.module'; // 确保 RedisModule 正确导入
import { UserModule } from '../user/user.module'; // 导入 UserModule

@Module({
  imports: [RedisModule, UserModule], // 确保导入顺序正确
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService], // 导出 EmailService 供其他模块使用
})
export class EmailModule {}
