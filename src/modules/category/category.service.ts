// src/category/category.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Article } from '../article/entities/article.entity';
import { Music } from '../music/entities/music.entity';
import { Video } from '../video/entities/video.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
    private readonly dataSource: DataSource,
  ) {}

  // 创建分类
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, type, parentCategoryId } = createCategoryDto;

    // 检查是否为一级分类
    if (!parentCategoryId) {
      // 检查一级分类名称是否重复
      const existingCategory = await this.categoryRepository.findOne({
        where: { name, parentCategory: null },
      });

      if (existingCategory) {
        throw new BadRequestException(`名称为 ${name} 的一级分类已存在`);
      }

      // 创建一级分类
      const category = this.categoryRepository.create({
        name,
        type,
        parentCategory: null,
      });
      return this.categoryRepository.save(category);
    }

    // 检查二级分类的逻辑
    const parentCategory = await this.categoryRepository.findOne({
      where: { id: parentCategoryId },
    });

    if (!parentCategory) {
      throw new NotFoundException(`父分类ID为${parentCategoryId}未找到`);
    }

    // 检查当前分类名称在同一层级下是否重复
    const existingSubCategory = await this.categoryRepository.findOne({
      where: { name, parentCategory },
    });

    if (existingSubCategory) {
      throw new BadRequestException(`名称为 ${name} 的子分类已存在`);
    }

    // 创建二级分类
    const category = this.categoryRepository.create({
      name,
      type,
      parentCategory,
    });

    return this.categoryRepository.save(category);
  }

  // 获取所有一级分类
  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.parentCategory IS NULL')
      .getMany();
    console.log('一级分类:', categories); // 添加日志
    return categories;
  }

  // 根据一级分类 ID 获取二级分类
  async findSubcategories(id: number): Promise<Category[]> {
    const parentCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subcategories'],
    });

    if (!parentCategory) {
      throw new NotFoundException(`一级分类 ID 为 ${id} 未找到`);
    }

    return parentCategory.subcategories;
  }

  // 更新分类
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    const { name, parentCategoryId, type } = updateCategoryDto;

    // 检查更新后的名称是否在同一层级下重复
    if (name !== undefined) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name, parentCategory: category.parentCategory },
      });

      if (existingCategory) {
        throw new BadRequestException(`名称为 ${name} 的分类已存在`);
      }
      category.name = name;
    }

    // 更新父分类
    if (parentCategoryId !== undefined) {
      if (parentCategoryId === null) {
        category.parentCategory = null;
      } else {
        if (parentCategoryId === id) {
          throw new BadRequestException('分类不能成为自己的父分类');
        }

        const parentCategory = await this.categoryRepository.findOne({
          where: { id: parentCategoryId },
          relations: ['parentCategory'],
        });
        if (!parentCategory) {
          throw new NotFoundException(`父分类ID为${parentCategoryId}未找到`);
        }

        // 检查是否形成循环引用
        let currentParent = parentCategory;
        while (currentParent) {
          if (currentParent.id === id) {
            throw new BadRequestException('分类不能形成循环引用');
          }
          currentParent = currentParent.parentCategory;
        }
        category.parentCategory = parentCategory;
      }
    }

    // 更新分类类型
    if (type !== undefined) {
      category.type = type;
    }

    return this.categoryRepository.save(category);
  }

  // 删除分类
  async remove(id: number): Promise<{ message: string }> {
    return await this.dataSource.transaction(async (manager) => {
      const category = await manager.findOne(Category, {
        where: { id },
        relations: ['subcategories'],
      });

      if (!category) {
        throw new NotFoundException(`类别ID为${id}未找到`);
      }

      // 检查是否有未删除的小类
      if (category.subcategories && category.subcategories.length > 0) {
        const activeSubcategories = category.subcategories.filter(
          (sub) => !sub.deletedAt,
        );
        if (activeSubcategories.length > 0) {
          throw new BadRequestException(
            `类别ID为${id}有未删除的小类别，无法删除`,
          );
        }
      }

      // 如果是小类，重新分配内容到父类
      if (category.parentCategory) {
        // 更新文章表
        await manager
          .createQueryBuilder()
          .update(Article)
          .set({ category: category.parentCategory })
          .where('categoryId = :id', { id })
          .execute();

        // 更新音乐表
        await manager
          .createQueryBuilder()
          .update(Music)
          .set({ category: category.parentCategory })
          .where('categoryId = :id', { id })
          .execute();

        // 更新视频表
        await manager
          .createQueryBuilder()
          .update(Video)
          .set({ category: category.parentCategory })
          .where('categoryId = :id', { id })
          .execute();
      }

      await manager.delete(Category, { id });

      return { message: '分类已成功删除' };
    });
  }

  // 查找单个分类
  private async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`类别ID为${id}未找到`);
    }
    return category;
  }
}
