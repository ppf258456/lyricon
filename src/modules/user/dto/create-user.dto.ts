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
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'john_doe' }) // 添加描述和示例
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @IsValidUsername()
  username: string;

  @ApiProperty({ description: '邮箱地址', example: 'john@example.com' }) // 添加描述和示例
  @IsEmail({}, { message: '无效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '用户密码', example: 'password123' }) // 添加描述和示例
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @IsValidPassword()
  password: string;

  @ApiProperty({
    description: '头像URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  }) // 可选项
  @IsOptional()
  @IsString({ message: '头像URL必须是字符串' })
  avatar?: string;

  @ApiProperty({
    description: '背景图片URL',
    example: 'https://example.com/background.jpg',
    required: false,
  }) // 可选项
  @IsOptional()
  @IsString({ message: '背景图片URL必须是字符串' })
  backgroundImage?: string;

  @ApiProperty({
    description: '个人简介',
    example: 'Hello, I am John!',
    required: false,
  }) // 可选项
  @IsOptional()
  @IsString({ message: '个人简介必须是字符串' })
  @MaxLength(300, { message: '个人简介最大可支持300字符！' })
  bio?: string;

  @ApiProperty({
    description: '用户角色',
    enum: ['VIEWER', 'ADMIN', 'EDITOR'],
    required: false,
  }) // 添加角色信息
  @IsOptional()
  @IsString({ message: '角色必须是字符串' })
  @Matches(/^(VIEWER|ADMIN|EDITOR)$/, {
    message: '角色必须是 VIEWER or ADMIN 或 EDITOR',
  })
  role?: UserRole; // 可选，默认为 VIEWER

  @ApiProperty({ description: '验证码', example: '123456' }) // 添加验证码信息
  @IsNotEmpty({ message: '验证码不能为空' }) // 添加验证
  @IsString({ message: '验证码必须是字符串' })
  verificationCode: string;
}
