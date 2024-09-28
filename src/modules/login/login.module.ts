import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { UserModule } from '../user/user.module'; // 导入 UserModule

@Module({
  controllers: [LoginController],
  imports: [UserModule], // 确保 UserModule 被导入
})
export class LoginModule {}
