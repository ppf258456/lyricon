import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

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

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  @Column({
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date; // 软删除时间
}
