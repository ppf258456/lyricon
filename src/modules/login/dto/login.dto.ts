// src/modules/auth/dto/login.dto.ts
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  emailOrUid: string; // 可以是邮箱或 UID

  @IsNotEmpty()
  password: string; // 用户密码
}
