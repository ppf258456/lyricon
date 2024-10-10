// src/entity/Category.ts

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
  Index,
  BeforeRemove,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { AppDataSource } from '../../../config/data-source'; // 根据实际路径调整
import { TreeRepository } from 'typeorm';

export enum CategoryType {
  ARTICLE = 'article',
  MUSIC = 'music',
  VIDEO = 'video',
}

@Entity()
@Tree('nested-set') // 使用 Nested Set 树结构，适合读多写少的场景
@Index(['type', 'name'], { unique: true }) // 在同一类型下名称唯一
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  /**
   * 类型字段
   * - 根类别（例如：BLOG）的 type 设置为其所属的根类型（如 article）
   * - 子类别（例如：JS）的 type 必须与父类别的 type 相同
   */
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
  deletedAt: Date | null;

  /**
   * 软删除钩子：级联软删除子节点
   */
  @BeforeRemove()
  async handleSoftDelete() {
    const categoryRepository: TreeRepository<Category> =
      AppDataSource.getTreeRepository(Category);
    const children = await categoryRepository.findDescendants(this);

    for (const child of children) {
      if (!child.deletedAt) {
        child.deletedAt = new Date();
        await categoryRepository.save(child);
      }
    }
  }

  /**
   * 验证父类别的类型是否与当前类别相同
   */
  @BeforeInsert()
  @BeforeUpdate()
  async validateParentCategory() {
    if (this.parentCategory) {
      if (this.parentCategory.type !== this.type) {
        throw new Error('父类别的类型必须与当前类别的类型相同。');
      }
    }
  }
}
