import { Module } from '@nestjs/common';
import { PrismaModule } from '../persistence/prisma/prisma.module';
import { RepositoryModule } from './repository.module';
import { CategoryService } from '../../application/services/category/category.service';
import { CategoryRepository } from '../../application/repositories/category-repository.interface';
import { CategoryController } from '../../presentation/controllers/category.controller';

@Module({
  imports: [PrismaModule, RepositoryModule],
  providers: [
    {
      provide: CategoryService,
      useFactory: (categoryRepository: CategoryRepository) => {
        return new CategoryService(categoryRepository);
      },
      inject: [CategoryRepository],
    },
  ],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
