import { Injectable, Logger, Inject, ConflictException } from '@nestjs/common';
import mailConfig from '../../config/smtp.config'; // 引入邮件配置
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private configService: ConfigService,
  ) {
    this.transporter = mailConfig(this.configService);
  }
  async onModuleInit() {
    await this.checkRedisConnection();
  }
  private async checkRedisConnection() {
    try {
      const pong = await this.redis.ping();
      this.logger.log(`Redis 已成功启动并连接: ${pong}`);
    } catch (error) {
      this.logger.error('Redis 连接失败:', error);
      throw new ConflictException('Redis 连接失败，请检查配置和连接状态。');
    }
  }

  async sendVerificationEmail(to: string): Promise<void> {
    const storedCode = await this.redis.get(to);
    if (storedCode) {
      this.logger.log('验证码已存在，不发送新的验证码');
      throw new ConflictException(
        '验证码已发送，5分钟内不再发送新的验证码，请检查您的邮箱。',
      );
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiresIn = 5 * 60; // 设置过期时间为5分钟
    await this.redis.set(to, verificationCode, 'EX', expiresIn);

    const mailOptions = {
      from: `"大杂烩BLOG" <${this.configService.get('SMTP_USER')}>`,
      to,
      subject: '您的邮箱验证码',
      text: `您的验证码是：${verificationCode}，请在5分钟内使用它完成验证。`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log('验证码已成功发送至您的邮箱');
    } catch (error) {
      this.logger.error('验证码发送错误:', error);
      throw new ConflictException('发送验证码失败！');
    }
  }

  async validateVerificationCode(
    email: string,
    code: string,
  ): Promise<boolean> {
    const storedCode = await this.redis.get(email);
    if (!storedCode) {
      throw new ConflictException('验证码不存在或已过期');
    }

    if (storedCode !== code) {
      throw new ConflictException('验证码错误');
    }

    await this.redis.del(email); // 验证成功后删除验证码
    return true;
  }
}
