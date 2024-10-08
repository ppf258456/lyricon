// src/category/category.controller.ts

import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/AdminGuard';
import { BaseGuard } from 'src/auth/base.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from './dto/pagination.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('分类') // 用于分组 API
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 创建分类
  @UseGuards(BaseGuard, AdminGuard) // 根据需要使用守卫
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        '内部服务器错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取所有分类（包含分页）

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.categoryService.findAll(paginationDto);
  }

  // 获取单个分类

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.categoryService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        '内部服务器错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 更新分类
  @UseGuards(BaseGuard, AdminGuard) // 根据需要使用守卫
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      return await this.categoryService.update(+id, updateCategoryDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        '内部服务器错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 删除分类
  @UseGuards(BaseGuard, AdminGuard) // 根据需要使用守卫
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.categoryService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        '内部服务器错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
