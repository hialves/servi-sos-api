import { HttpStatus, Injectable } from '@nestjs/common';
import { ID } from '../../domain/entities';
import { Category } from '../../domain/entities/category';
import { UpdateCategoryData } from '../../domain/valueobjects/update-category-data';
import { ApplicationError } from '../errors/application-error';
import { responseMessages } from '../messages/response.messages';
import { CategoryRepository } from '../repositories/category-repository.interface';
import { CreateCategoryDto } from '../../presentation/dto/category/create-category.dto';

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
    const category = await this.repository.findById(id);
    if (!category)
      return new ApplicationError(responseMessages.notFound(responseMessages.category), HttpStatus.NOT_FOUND);
    if (updateData.data.name && category.parentId) {
      const conflict = await this.checkConflictName(updateData.data.name, category?.parentId);
      if (conflict) return conflict;
    }

    if (updateData.data.name !== undefined) category.name = updateData.data.name;
    if (updateData.data.parentId !== undefined) category.parentId = updateData.data.parentId;
    if (updateData.data.isFinal !== undefined) category.isFinal = updateData.data.isFinal;

    return this.repository.update(category);
  }

  private async checkConflictName(name: string, parentId?: ID): Promise<ApplicationError | undefined> {
    const _parentId = parentId || null;
    const category = await this.repository.findByNameAndParent(name, _parentId);
    if (category && category.nameConflictedInSameParentId(_parentId)) {
      return new ApplicationError(responseMessages.category.nameConflictError, HttpStatus.CONFLICT);
    }
  }
}
