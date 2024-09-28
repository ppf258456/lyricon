// src/modules/user/user.controller.ts
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  ConflictException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { error } from 'console';
import { LoginDto } from '../login/dto/login.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name); // 创建 Logger 实例

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);
    if (newUser) {
      // 记录成功日志
      this.logger.log(`新用户注册成功: ${JSON.stringify(newUser)}`);
    } else {
      this.logger.error('错误：', error);
    }

    return newUser; // 返回新用户对象
  }

  @Post('check-username')
  @UsePipes(new ValidationPipe())
  async checkUsername(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByUserName(
      createUserDto.username,
    );
    if (existingUser) {
      throw new ConflictException('该用户名已被注册！');
    }
    return { message: '该用户名可用！' };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.userService.login(loginDto);
      return result; // 返回登录结果
    } catch (error) {
      this.logger.error('登录失败：', error);
      throw new UnauthorizedException('登录失败，邮箱或密码错误');
    }
  }
}
