// src/modules/user/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import {
  IsValidUsername,
  IsValidPassword,
} from '../../../decorators/custom-validation.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @IsValidUsername()
  username: string;

  @IsEmail({}, { message: '无效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @IsValidPassword()
  password: string;

  @IsOptional()
  @IsString({ message: '头像URL必须是字符串' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: '背景图片URL必须是字符串' })
  backgroundImage?: string;

  @IsOptional()
  @IsString({ message: '个人简介必须是字符串' })
  @MaxLength(300, { message: '个人简介最大可支持300字符！' })
  bio?: string;

  @IsOptional()
  @IsString({ message: '角色必须是字符串' })
  @Matches(/^(VIEWER|ADMIN|EDITOR)$/, {
    message: '角色必须是 VIEWER or ADMIN 或 EDITOR',
  })
  role?: UserRole; // 可选，默认为 VIEWER

  @IsNotEmpty({ message: '验证码不能为空' }) // 添加验证
  @IsString({ message: '验证码必须是字符串' })
  verificationCode: string;
}
