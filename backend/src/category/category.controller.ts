import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from './dto/category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Category as PrismaCategory } from '@prisma/client';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category for the current user' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully.',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiBody({ type: CreateCategoryDto })
  async create(
    @CurrentUser() userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.create(
      userId,
      createCategoryDto,
    );
    return this.mapToCategoryResponseDto(category);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of categories.',
    type: [CategoryResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() userId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryService.findAll(userId);
    return categories.map((category) =>
      this.mapToCategoryResponseDto(category),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category details.',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (access denied)' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Category ID',
  })
  async findOne(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.findOne(userId, id);
    return this.mapToCategoryResponseDto(category);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully.',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (access denied)' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Category ID',
  })
  @ApiBody({ type: UpdateCategoryDto })
  async update(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.update(
      userId,
      id,
      updateCategoryDto,
    );
    return this.mapToCategoryResponseDto(category);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific category by ID' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (access denied)' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Category ID',
  })
  async remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.categoryService.remove(userId, id);
  }

  // Helper method to map Prisma Category to CategoryResponseDto
  private mapToCategoryResponseDto(
    category: PrismaCategory,
  ): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      userId: category.userId,
      icon: category.icon ?? undefined,
      categoryTypeId: category.categoryTypeId ?? null,
      categoryTypeNameSnapshot: category.categoryTypeNameSnapshot ?? undefined,
    };
  }
}
