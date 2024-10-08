// src/modules/login/login.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { ApiTags } from '@nestjs/swagger';
@Controller('login')
export class LoginController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('登录') // 用于分组 API
  @Post('')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.userService.login(loginDto);
    console.log('登录成功的用户信息:', result); // 打印登录成功的用户信息
    return result;
  }
}
