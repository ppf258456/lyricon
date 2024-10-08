// src/decorators/swagger.decorators.ts
import { ApiProperty } from '@nestjs/swagger';

export function ApiPropertyOptional(options?: any) {
  return ApiProperty({ required: false, ...options });
}

export function ApiPropertyWithExample(options: any) {
  return ApiProperty({ example: options.example, ...options });
}
