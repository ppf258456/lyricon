// src/config/mail.config.ts
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export default function mailConfig(configService: ConfigService) {
  const transporter = nodemailer.createTransport({
    host: configService.get<string>('SMTP_HOST'),
    port: configService.get<number>('SMTP_PORT'),
    secure: configService.get<string>('SMTP_SECURE') === 'true',
    auth: {
      user: configService.get<string>('SMTP_USER'),
      pass: configService.get<string>('SMTP_PASS'),
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.error('邮件发送验证码错误:', error);
    } else {
      console.log('邮件已准备好！');
    }
  });

  return transporter;
}
