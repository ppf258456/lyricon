import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { CategoryType } from '../entities/category.entity'; // 确保路径正确
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description:
      '分类名称（该项的父类若为 article miusic 或者 video 中的一个，则不存在parentCategoryId，否则需指定parentCategoryId）',
    example: 'JS',
  }) // 添加描述和示例
  @IsNotEmpty()
  name: string; // 分类名称

  @ApiProperty({
    description: '大类类型 值为article miusic或者video',
    example: 'article',
  }) // 添加描述和示例
  @IsNotEmpty()
  @IsEnum(CategoryType)
  type: CategoryType; // 大类类型

  @ApiProperty({
    description:
      '可选项，建议如果创建分类为JS这种细致类型，带好相应的父类id，以便做好分类',
    example: 1,
  }) // 添加描述和示例
  @IsOptional()
  parentCategoryId?: number; // 可选的父分类ID
}
