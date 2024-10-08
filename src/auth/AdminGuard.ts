import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BaseGuard } from './base.guard'; // 确保导入正确

@Injectable()
export class JwtAuthGuard extends BaseGuard {}

@Injectable()
export class AdminGuard extends BaseGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context); // 调用基础守卫的逻辑
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role; // 假设角色信息在用户信息中

    if (userRole !== 'admin') {
      throw new ForbiddenException('没有权限访问此资源');
    }

    return true;
  }
}
