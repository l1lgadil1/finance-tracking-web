import { Module } from '@nestjs/common';
import { CategoryTypeService } from './category-type.service';
import { CategoryTypeController } from './category-type.controller';

@Module({
  providers: [CategoryTypeService],
  controllers: [CategoryTypeController],
  exports: [CategoryTypeService],
})
export class CategoryTypeModule {}
