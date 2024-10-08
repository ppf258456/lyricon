import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Article } from '../../article/entities/article.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string; // 评论内容

  @ManyToOne(() => User, (user) => user.comments)
  author: User; // 评论作者

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article; // 关联的文章

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date; // 评论时间

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date; // 软删除时间

  @Column({ type: 'int', default: 0 })
  likeCount: number; // 点赞数
}
