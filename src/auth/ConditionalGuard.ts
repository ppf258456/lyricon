import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ConditionalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const method = request.method; // 获取请求方法
    const url = request.url; // 获取请求 URL
    // 检查请求是否为 GET 方法
    if (method === 'GET') {
      // 处理 GET 请求的逻辑
      return true;
    }
    // 如果是特定的 GET 请求，允许通过
    if (url === '/category' || url.startsWith('/category/')) {
      return true;
    }

    // 否则，执行默认验证逻辑
    return this.defaultGuardLogic(request);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private defaultGuardLogic(request): boolean {
    // 你的默认验证逻辑
    return true; // 或者根据需要返回 false
  }
}
