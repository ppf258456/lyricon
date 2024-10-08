// src/modules/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '邮箱', example: '1234@qq.com' })
  @IsNotEmpty()
  emailOrUid: string; // 可以是邮箱或 UID

  @ApiProperty({ description: '用户密码', example: 'password12345555' }) // 添加描述和示例
  @IsNotEmpty()
  password: string; // 用户密码
}
