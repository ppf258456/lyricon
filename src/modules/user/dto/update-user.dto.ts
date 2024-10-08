import { OmitType } from '@nestjs/mapped-types/dist';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'email',
  'password',
  'role',
  'verificationCode',
] as const) {
  @ApiProperty({ description: '头像URL，有默认值', required: false })
  avatar?: string;

  @ApiProperty({ description: '背景图片URL，有默认值', required: false })
  backgroundImage?: string;

  @ApiProperty({
    description: '个人简介，最大长度300字符，有默认值',
    required: false,
  })
  bio?: string;
}
