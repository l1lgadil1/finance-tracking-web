import { Controller, Get, Param, ParseUUIDPipe, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoryTypeService } from './category-type.service';
import { CategoryTypeResponseDto } from './dto/category-type-response.dto';
import { CategoryType } from '@prisma/client';

@ApiTags('Category Types')
@Controller('category-types')
export class CategoryTypeController {
  private readonly logger = new Logger(CategoryTypeController.name);

  constructor(private readonly service: CategoryTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all system category types' })
  @ApiResponse({
    status: 200,
    description: 'List of category types',
    type: [CategoryTypeResponseDto],
  })
  async findAll(): Promise<CategoryTypeResponseDto[]> {
    this.logger.log('Fetching all system category types');
    const types = await this.service.findAllSystem();
    this.logger.log(`Found ${types.length} system category types`);
    return types.map((type) => this.mapToCategoryTypeResponse(type));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category type by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Category type ID' })
  @ApiResponse({
    status: 200,
    description: 'Category type found',
    type: CategoryTypeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category type not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryTypeResponseDto> {
    this.logger.log(`Fetching category type with ID: ${id}`);
    const type = await this.service.findOneById(id);
    return this.mapToCategoryTypeResponse(type);
  }

  // Helper method to map Prisma CategoryType to CategoryTypeResponseDto
  private mapToCategoryTypeResponse(
    type: CategoryType,
  ): CategoryTypeResponseDto {
    return {
      id: type.id,
      name: type.name,
      userId: type.userId,
      isSystem: type.isSystem,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    };
  }
}
