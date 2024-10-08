import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

import { UserModule } from '../user/user.module'; // 导入 UserModule

@Module({
  imports: [UserModule], // 确保导入顺序正确
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService], // 导出 EmailService 供其他模块使用
})
export class EmailModule {}
