// src/@types/express.d.ts
import { User } from '../modules/user/entities/user.entity'; // 根据你的 User 实体路径调整

declare global {
  namespace Express {
    interface Request {
      user?: User; // 添加 user 属性
    }
  }
}
