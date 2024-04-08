import { ID } from '../../domain/entities';
import { Category } from '../../domain/entities/category';
import { CreateCategoryData } from '../../domain/valueobjects/create-category-data';

export abstract class CategoryRepository {
  abstract create(input: CreateCategoryData): Promise<Category>;
  abstract bulkCreate(parentId: ID, children: CreateCategoryData[]): Promise<Category | null>;
  abstract findById(id: ID): Promise<Category | null>;
  abstract findByName(name: string): Promise<Category | null>;
  abstract update(input: Category): Promise<Category>;
  abstract remove(id: ID): Promise<void>;
}
