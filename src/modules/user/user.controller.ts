// src/modules/user/user.controller.ts
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  ConflictException,
  Logger,
  Headers,
  UseGuards,
  Get,
  UnauthorizedException,
  Param,
  Patch,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { error } from 'console';
import { BaseGuard } from '../../auth/base.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('用户') // 用于分组 API
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

  @Get('list')
  @UseGuards(BaseGuard) // 使用 JWT 守卫
  async userList(@Headers('authorization') authHeader: string) {
    const user = await this.userService.getUserFromToken(authHeader);

    if (!user) {
      throw new UnauthorizedException('用户未找到'); // 如果用户未找到，抛出异常
    }

    return this.userService.findAll(user.role); // 调用 service 方法，传递用户角色
  }

  @Get(':id')
  async userInfo(
    @Param('id') id: number,
    @Headers('authorization') authHeader: string,
  ) {
    const userData = await this.userService.findOne(id, authHeader); // 获取请求用户信息
    return userData; // 查询指定用户
  }

  @Patch('update/:id')
  @UseGuards(BaseGuard)
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('authorization') authHeader: string,
  ) {
    const currentUser = await this.userService.getUserFromToken(authHeader);

    if (!currentUser) {
      throw new UnauthorizedException('用户未找到');
    }

    if (currentUser.id !== userId) {
      throw new ForbiddenException('仅用户本人可以更新信息');
    }

    await this.userService.update(userId, updateUserDto, currentUser.id);
    // 更新成功
    return { message: '更新成功！' };
  }
  @Delete(':id')
  @UseGuards(BaseGuard)
  async deleteUser(
    @Param('id') userId: number,
    @Headers('authorization') authHeader: string,
  ) {
    const currentUser = await this.userService.getUserFromToken(authHeader);

    if (!currentUser) {
      throw new UnauthorizedException('用户未找到');
    }

    if (currentUser.id !== userId && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('仅用户本人或管理员可以删除用户');
    }

    await this.userService.softDelete(userId);
    // 删除成功，不返回任何内容
    return { message: '删除成功' };
  }
}
