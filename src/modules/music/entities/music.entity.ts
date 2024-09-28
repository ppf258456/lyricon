import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Music {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // 音乐标题

  @Column()
  artist: string; // 艺术家

  @Column({ nullable: true })
  album: string; // 专辑

  @Column({ nullable: true })
  duration: number; // 时长（秒）

  @Column()
  filePath: string; // 上传音频文件的存储路径

  @Column({ nullable: true })
  externalId: string; // 第三方库的音乐ID

  @Column({ nullable: true })
  genre: string; // 音乐类型

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date; // 软删除时间

  @ManyToOne(() => User, (user) => user.music)
  author: User;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;
}
