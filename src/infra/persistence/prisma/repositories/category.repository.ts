import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ID } from '../../../../domain/entities';
import { Category } from '../../../../domain/entities/category';
import { Category as PrismaCategory } from '@prisma/client';
import { CategoryRepository } from '../../../../application/repositories/category-repository.interface';
import { CreateCategoryData } from '../../../../domain/valueobjects/create-category-data';

function toDomain(result: PrismaCategory | null): Category | null {
  if (result) return new Category(result);
  return null;
}

@Injectable()
export class CategoryPrismaRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.category;
  }

  async create(input: CreateCategoryData) {
    const result = await this.repository.create({ data: input.data, include: { parent: true, children: true } });

    return new Category(result);
  }

  async bulkCreate(parentId: number, children: CreateCategoryData[]): Promise<Category | null> {
    const result = await this.repository.update({
      where: { id: parentId },
      data: { children: { createMany: { data: children.map((item) => item.data) } } },
    });

    return toDomain(result);
  }

  async findById(id: ID): Promise<Category | null> {
    const result = await this.repository.findUnique({
      where: { id },
    });
    return toDomain(result);
  }

  async findByName(name: string): Promise<Category | null> {
    const result = await this.repository.findFirst({
      where: { name },
    });
    return toDomain(result);
  }

  async update(input: Category): Promise<Category> {
    const category = await this.repository.update({ where: { id: input.id }, data: input });
    return new Category(category);
  }

  async remove(id: ID): Promise<void> {
    await this.repository.delete({
      where: { id },
    });
  }
}
