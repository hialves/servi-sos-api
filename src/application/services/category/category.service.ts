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
    if (input.parentId) {
      const existsParent = await this.repository.findById(input.parentId);
      if (!existsParent)
        return new ApplicationError(responseMessages.notFound(responseMessages.category), HttpStatus.NOT_FOUND);
    }
    const conflict = await this.checkConflictName(input.name, input.parentId);
    if (conflict) return conflict;

    return this.repository.create(input);
  }

  async update(id: ID, updateData: UpdateCategoryData): Promise<Category | ApplicationError> {
    const existsCategory = await this.repository.findById(id);
    if (!existsCategory)
      return new ApplicationError(responseMessages.notFound(responseMessages.category), HttpStatus.NOT_FOUND);
    if (updateData.data.name && existsCategory.parentId) {
      const conflict = await this.checkConflictName(updateData.data.name, existsCategory?.parentId);
      if (conflict) return conflict;
    }

    const category = new Category({
      ...existsCategory,
      ...updateData.data,
    });

    return this.repository.update(category);
  }

  private async checkConflictName(name: string, parentId?: ID): Promise<ApplicationError | undefined> {
    const _parentId = parentId || null;
    const exists = await this.repository.findByNameAndParent(name, _parentId);
    if (exists && exists.nameConflictedInSameParentId(_parentId)) {
      return new ApplicationError(responseMessages.category.nameConflictError, HttpStatus.CONFLICT);
    }
  }
}
