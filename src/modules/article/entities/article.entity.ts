import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum ArticleStatus {
  DRAFT = 0, // 审核中
  APPROVED = 1, // 已通过
  REJECTED = 2, // 未通过
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  pic: string;

  @Column('text')
  content: string;

  @Column({ type: 'int', default: 0 })
  readCount: number;

  @Column({ type: 'int', default: 0 })
  shareCount: number;

  @Column({ type: 'int', default: 0 })
  coinCount: number;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ type: 'int', default: 0 })
  commentCount: number;

  @Column({ type: 'int', default: 0 })
  favoriteCount: number;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @Column({ type: 'int', default: ArticleStatus.DRAFT })
  status: ArticleStatus; // 文章状态
}
