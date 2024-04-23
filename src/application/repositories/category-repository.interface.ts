import { ID } from '../../domain/entities';
import { Category } from '../../domain/entities/category';
import { CreateCategoryDto } from '../../presentation/dto/category/create-category.dto';

export abstract class CategoryRepository {
  abstract create(input: CreateCategoryDto): Promise<Category>;
  abstract bulkCreate(parentId: ID, children: CreateCategoryDto[]): Promise<Category | null>;
  abstract findById(id: ID): Promise<Category | null>;
  abstract findByNameAndParent(name: string, parentId: ID | null): Promise<Category | null>;
  abstract update(input: Category): Promise<Category>;
  abstract remove(id: ID): Promise<void>;
}
