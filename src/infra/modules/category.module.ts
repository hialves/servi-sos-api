import { Module } from '@nestjs/common';
import { CategoryService } from '../../application/services/category/category.service';
import { CategoryController } from '../../presentation/controllers/category.controller';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
