import { HttpStatus, Injectable } from '@nestjs/common';
import { ID } from '../../../domain/entities';
import { Category } from '../../../domain/entities/category';
import { UpdateCategoryData } from '../../../domain/valueobjects/update-category-data';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { CategoryRepository } from '../../repositories/category-repository.interface';
import { CreateCategoryDto } from '../../../presentation/dto/category/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  async create(input: CreateCategoryDto) {
    const exists = await this.repository.findByNameAndParent(input.name, input.parentId || null);
    if (exists && exists.nameConflictedInSameParentId(input.parentId || null)) {
      return new ApplicationError(responseMessages.category.nameConflictError, HttpStatus.CONFLICT);
    }

    if (input.parentId) {
      const exists2 = await this.repository.findById(input.parentId);
      if (exists2 && exists2.nameConflictedInSameParentId(input.parentId))
    }
    return this.repository.create(input);
  }

  async update(id: ID, updateData: UpdateCategoryData): Promise<Category | ApplicationError> {
    const existsCategory = await this.repository.findById(id);
    if (!existsCategory)
      return new ApplicationError(
        responseMessages.notFound(responseMessages.category.entity, responseMessages.category.finalLetter),
        HttpStatus.NOT_FOUND,
      );
    if (updateData.data.name && existsCategory.parentId) {
      const exists = await this.repository.findByName(updateData.data.name);
      if (exists && exists.nameConflictedInSameParentId(existsCategory.parentId || null)) {
        return new ApplicationError(responseMessages.category.nameConflictError, HttpStatus.CONFLICT);
      }
    }

    const category = new Category({
      ...existsCategory,
      ...updateData.data,
    });

    return this.repository.update(category);
  }
}
