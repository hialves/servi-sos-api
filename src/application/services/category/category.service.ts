import { HttpStatus } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { Category } from '../../../domain/entities/category';
import { UpdateCategoryData } from '../../../domain/valueobjects/update-category-data';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { CategoryRepository } from '../../repositories/category-repository.interface';
import { CreateCategoryData } from '../../../domain/valueobjects/create-category-data';

export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  async create(input: CreateCategoryData) {
    if (input.data.parentId) {
      const exists = await this.repository.findByName(input.data.name);
      if (exists && exists.nameConflictedInSameParentId(input.data.parentId)) {
        return new ApplicationError(responseMessages.category.nameConflictError, undefined, HttpStatus.CONFLICT);
      }
    }
    return this.repository.create(input);
  }

  async update(id: ID, updateData: UpdateCategoryData): Promise<Category | ApplicationError> {
    const existsCategory = await this.repository.findById(id);
    if (!existsCategory)
      return new ApplicationError(
        responseMessages.notFound(responseMessages.category.entity, responseMessages.category.finalLetter),
        undefined,
        HttpStatus.NOT_FOUND,
      );
    if (updateData.data.name && existsCategory.parentId) {
      const exists = await this.repository.findByName(updateData.data.name);
      if (exists && exists.nameConflictedInSameParentId(existsCategory.parentId)) {
        return new ApplicationError(responseMessages.category.nameConflictError, undefined, HttpStatus.CONFLICT);
      }
    }

    console.log({
      ...existsCategory,
      ...updateData.data,
    });

    const category = new Category({
      ...existsCategory,
      ...updateData.data,
    });

    return this.repository.update(category);
  }
}
