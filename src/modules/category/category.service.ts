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
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
    private readonly dataSource: DataSource,
  ) {}
  // 获取所有分类及其层级
  async findAllWithHierarchy(): Promise<Category[]> {
    return this.categoryRepository.findTrees();
  }
  // 创建分类
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, type, parentCategoryId } = createCategoryDto;
    let parentCategory: Category | null = null;

    if (parentCategoryId) {
      parentCategory = await this.categoryRepository.findOne({
        where: { id: parentCategoryId },
      });
      if (!parentCategory) {
        throw new NotFoundException(`父分类ID为${parentCategoryId}未找到`);
      }
      // 防止循环引用
      if (parentCategory.id === parentCategoryId) {
        throw new BadRequestException('分类不能成为自己的父分类');
      }
    }

    const category = this.categoryRepository.create({
      name,
      type,
      parentCategory,
    });
    return this.categoryRepository.save(category);
  }

  // 获取所有分类
  async findAll(paginationDto: PaginationDto): Promise<Category[]> {
    const { page, limit } = paginationDto;
    return this.categoryRepository.find({
      relations: ['parentCategory', 'subcategories'],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  // 获取单个分类
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parentCategory', 'subcategories'],
    });
    if (!category) {
      throw new NotFoundException(`类别ID为${id}未找到`);
    }
    return category;
  }

  // 更新分类
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.parentCategoryId !== undefined) {
      if (updateCategoryDto.parentCategoryId === null) {
        category.parentCategory = null;
      } else {
        if (updateCategoryDto.parentCategoryId === id) {
          throw new BadRequestException('分类不能成为自己的父分类');
        }
        const parentCategory = await this.categoryRepository.findOne({
          where: { id: updateCategoryDto.parentCategoryId },
          relations: ['parentCategory'],
        });
        if (!parentCategory) {
          throw new NotFoundException(
            `父分类ID为${updateCategoryDto.parentCategoryId}未找到`,
          );
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

    if (updateCategoryDto.name !== undefined) {
      category.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.type !== undefined) {
      category.type = updateCategoryDto.type;
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

      // 软删除分类
      await manager.softDelete(Category, id);
      return { message: `类别ID为${id}已被删除并重新分配内容` };
    });
  }
}
