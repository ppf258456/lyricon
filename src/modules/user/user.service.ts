// src/modules/user/user.service.ts
import {
  Injectable,
  ConflictException,
  Inject,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import { LoginDto } from '../login/dto/login.dto';
import { JwtService } from '@nestjs/jwt'; // 导入 JwtService
import { UpdateUserDto } from './dto/update-user.dto';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('REDIS_CLIENT') // 确保这里的提供者名称一致
    private readonly redis: Redis,
    private readonly jwtService: JwtService, // 注入 JwtService
  ) {}
  onModuleInit() {
    // 启动时可以执行一次检查
    this.checkAndDeleteUsers();
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUserName(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {
      email,
      password,
      username,
      avatar,
      backgroundImage,
      bio,
      verificationCode,
    } = createUserDto;

    // 验证验证码
    const storedCode = await this.redis.get(email);
    if (!storedCode || storedCode !== verificationCode) {
      throw new ConflictException('验证码无效或已过期');
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    const bioText = bio || process.env.DEFAULT_BIO;
    // 创建新用户
    const newUser = this.userRepository.create({
      uid: uuidv4(), // 生成 UID
      isActive: true, // 默认激活
      role: createUserDto.role || UserRole.VIEWER, // 使用 DTO 中的角色或默认角色
      coins: 0, // 默认硬币数
      fans: [], // 默认粉丝为空数组
      following: [], // 默认关注为空数组
      level: 0, // 默认等级
      createdAt: new Date(), // 创建时间
      updatedAt: new Date(), // 更新时间
      email,
      password: hashedPassword,
      username,
      avatar: avatar || process.env.DEFAULT_AVATAR,
      backgroundImage: backgroundImage || process.env.DEFAULT_BACKGROUND_IMAGE,
      bio: bioText,
    });

    // 保存到数据库
    return this.userRepository.save(newUser);
  }
  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; message: string }> {
    const { emailOrUid, password } = loginDto;

    // 查找用户
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUid }, { uid: emailOrUid }],
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }

    // 生成访问令牌 (JWT)
    const accessToken = this.generateAccessToken(user);

    // 将 token 存入 Redis
    await this.redis.set(`token:${user.id}`, accessToken, 'EX', 3600); // 设置 1 小时过期

    return {
      accessToken,
      message: '登录成功',
    };
  }

  async findAll(userRole: UserRole) {
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('仅管理员可以查看所有用户');
    }
    const users = await this.userRepository.find();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userData } = user;
      return userData; // 返回不包含密码的用户数据
    });
  }

  async findOne(id: number, authHeader?: string) {
    const userData = await this.userRepository.findOneBy({ id });
    if (!userData) {
      throw new NotFoundException('用户未找到');
    } else if (userData.isActive === false) {
      throw new NotFoundException('用户未找到');
    }

    if (!authHeader) {
      // 未登录用户返回基本信息
      return {
        username: userData.username,
        bio: userData.bio,
        avatar: userData.avatar,
      };
    }

    // 已登录用户返回详细信息
    const token = authHeader.split(' ')[1];
    const payload = await this.jwtService.verifyAsync(token);
    if (payload) {
      return {
        username: userData.username,
        bio: userData.bio,
        avatar: userData.avatar,
        uid: userData.uid,
        backgroundImage: userData.backgroundImage,
        coins: userData.coins,
        level: userData.level,
      }; // 返回完整用户信息
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (id !== userId) {
      throw new ForbiddenException('仅用户本人可以更新信息');
    }
    if (user.isActive === false) {
      throw new ForbiddenException('用户账户已被冻结，无法更新信息');
    }
    await this.userRepository.update(id, updateUserDto);
    return { message: '更新成功' }; // 返回提示信息
  }

  async softDelete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('用户未找到');
    }

    await this.userRepository.softDelete(id);
    return { message: '删除成功！' };
  }

  private generateAccessToken(user: User): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user; // 去掉密码字段
    return this.jwtService.sign({
      id: userData.id,
      uid: userData.uid,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      level: userData.level,
    }); // 使用更新后的用户数据
  }

  async getUserFromToken(authHeader: string): Promise<User> {
    const token = authHeader.split(' ')[1]; // 提取 Bearer Token
    const payload = await this.jwtService.verifyAsync(token); // 验证 token
    return this.userRepository.findOne({ where: { id: payload.id } }); // 使用 findOne 以避免未找到用户时抛出错误
  }

  async clearUserInfo(userId: number) {
    await this.userRepository.update(userId, {
      username: '已注销用户',
      email: '已注销邮箱',
      password: '111111', // 如果密码不能为null，考虑使用默认值
      avatar: '默认头像URL',
      backgroundImage: '默认背景图URL',
      bio: '该用户已注销',
      coins: 0,
      lastLogin: null,
      devices: null,
    });
  }

  @Cron('0 0 * * *') // 每天午夜执行
  async checkAndDeleteUsers() {
    const usersToDelete = await this.userRepository.find({
      where: { deletedAt: Not(IsNull()) },
    });
    const currentDate = new Date();

    for (const user of usersToDelete) {
      const deletionDate = new Date(user.deletedAt);
      const diffDays =
        (currentDate.getTime() - deletionDate.getTime()) / (1000 * 3600 * 24);

      if (diffDays >= 15) {
        await this.clearUserInfo(user.id); // 清空用户信息
      }
    }
  }
}
