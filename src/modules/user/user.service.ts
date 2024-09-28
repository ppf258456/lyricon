// src/modules/user/user.service.ts
import {
  Injectable,
  ConflictException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import { LoginDto } from '../login/dto/login.dto';
import { JwtService } from '@nestjs/jwt'; // 导入 JwtService
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('REDIS_CLIENT') // 确保这里的提供者名称一致
    private readonly redis: Redis,
    private readonly jwtService: JwtService, // 注入 JwtService
  ) {}

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
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
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
    return { accessToken };
  }

  private generateAccessToken(user: User): string {
    // 实现你的 JWT 生成逻辑
    // 例如：return this.jwtService.sign({ id: user.id, email: user.email });
    return this.jwtService.sign({ id: user.id, email: user.email });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
