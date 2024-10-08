// src/modules/email/email.controller.ts
import {
  Controller,
  Post,
  Body,
  ConflictException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { UserService } from '../user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('邮件') // 用于分组 API
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  @Post('send-verification')
  async sendVerification(@Body() body: { email: string }) {
    const { email } = body;

    // 先检查用户是否存在
    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new ConflictException('邮箱已注册，请找回密码');
    }

    try {
      await this.emailService.sendVerificationEmail(email);
      return { message: '验证码已发送！' };
    } catch (error) {
      if (error instanceof ConflictException) {
        return { message: error.message };
      }
      throw new ConflictException('发送验证码失败！');
    }
  }

  @Post('verify-code')
  @UsePipes(new ValidationPipe())
  async verifyCode(@Body() body: { email: string; code: string }) {
    const { email, code } = body;
    const isValid = await this.emailService.validateVerificationCode(
      email,
      code,
    );
    return { message: '验证码验证成功！', valid: isValid };
  }
}
