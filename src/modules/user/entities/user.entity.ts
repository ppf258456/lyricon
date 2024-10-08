import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Article } from '../../article/entities/article.entity';
import { Music } from '../../music/entities/music.entity';
import { Video } from '../../video/entities/video.entity';
import { Comment } from '../../comments/entities/comment.entity'; // 导入评论实体
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum UserLevel {
  LEVEL_0 = 0,
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  LEVEL_5 = 5,
  LEVEL_6 = 6,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string; // 用户唯一标识符

  @Column({ nullable: false, unique: true })
  username: string; // 用户名

  @Column()
  password: string; // 用户密码（应加密存储）

  @Column({ nullable: false, unique: true })
  email: string; // 用户电子邮件

  @Column({ default: true })
  isActive: boolean; // 用户是否激活

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @Column({ nullable: true, type: 'longtext' })
  avatar: string; // 头像

  @Column({ nullable: true, type: 'longtext' })
  backgroundImage: string; // 背景图 URL

  @Column({ nullable: true })
  bio: string; // 个人简介

  @Column({ default: 0 })
  coins: number; // 硬币数

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date; // 最后登录时间

  @Column('simple-array', { nullable: true })
  devices: string[]; // 登录设备

  @ManyToMany(() => User)
  @JoinTable()
  fans: User[]; // 粉丝

  @ManyToMany(() => User)
  @JoinTable()
  following: User[]; // 关注的用户

  @Column({
    type: 'enum',
    enum: UserLevel,
    default: UserLevel.LEVEL_0,
  })
  level: UserLevel; // 用户等级

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // 创建时间

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date; // 更新时间

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date; // 软删除时间

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Music, (music) => music.author)
  music: Music[];

  @OneToMany(() => Video, (video) => video.author)
  videos: Video[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[]; // 用户的评论

  constructor() {
    this.uid = uuidv4(); // 生成 UID
  }
}
