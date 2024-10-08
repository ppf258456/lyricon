import { DataSource } from 'typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Article } from '../modules/article/entities/article.entity';
import { Category } from '../modules/category/entities//category.entity';
import { Music } from '../modules/music/entities/music.entity';
import { Video } from '../modules/video/entities/video.entity';
import { Comment } from '../modules/comments/entities/comment.entity';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASS || '123456',
  database: process.env.DATABASE_NAME || 'lyricon',
  entities: [User, Article, Category, Music, Video, Comment],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // 生产环境建议关闭
  logging: true,
});
