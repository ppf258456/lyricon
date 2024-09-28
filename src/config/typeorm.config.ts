// src/config/typeorm.config.ts
// src/config/typeorm.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from '../modules/user/entities/user.entity';
import { Article } from '../modules/article/entities/article.entity';
import { Category } from '../modules/category/entities//category.entity';
import { Music } from '../modules/music/entities/music.entity';
import { Video } from '../modules/video/entities/video.entity';

export default function typeormConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'mysql', // 或者你使用的数据库类型
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASS'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [User, Article, Category, Music, Video],
    synchronize: true, // 开发环境下使用，生产环境建议关闭
  };
}
