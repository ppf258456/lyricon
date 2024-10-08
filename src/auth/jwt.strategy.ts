import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../modules/user/user.service';
import { JwtPayload } from './jwt.payload'; // 你需要定义这个接口

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.id, // 用户 ID
      uid: payload.uid, // 用户唯一标识符
      username: payload.username, // 用户名
      email: payload.email, // 用户电子邮件
      role: payload.role, // 用户角色
      level: payload.level, // 用户等级 }; // 返回用户数据
    };
  }
}
