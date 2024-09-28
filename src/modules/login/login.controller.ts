// src/modules/login/login.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';

@Controller('login')
export class LoginController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}
