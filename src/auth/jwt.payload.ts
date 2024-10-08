import { UserLevel, UserRole } from 'src/modules/user/entities/user.entity';

// src/auth/jwt.payload.ts
export interface JwtPayload {
  id: number; // 用户 ID
  uid: string; // 用户唯一标识符
  username: string; // 用户名
  email: string; // 用户电子邮件
  role: UserRole; // 用户角色
  level: UserLevel; // 用户等级
}
