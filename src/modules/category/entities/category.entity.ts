import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum CategoryType {
  ARTICLE = 'article',
  MUSIC = 'music',
  VIDEO = 'video',
}

@Entity()
@Tree('closure-table') // 或 "materialized-path"、"nested-set"
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    nullable: false,
  })
  type: CategoryType;

  @TreeParent()
  parentCategory: Category | null;

  @TreeChildren()
  subcategories: Category[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
