import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    console.log(
      `Attempting to create category with type ID: ${createCategoryDto.categoryTypeId} for user: ${userId}`,
    );

    // Fetch the category type without validating ownership
    const type = await this.prisma.categoryType.findUnique({
      where: { id: createCategoryDto.categoryTypeId },
    });

    console.log('Category type found:', type);

    // Only check if the type exists and is not deleted
    if (!type || type.deletedAt) {
      console.log('Category type not found or deleted, throwing error');
      throw new NotFoundException('Category type not found');
    }

    // Skip the ownership check (type.userId !== userId) since category types are global
    console.log(
      `Creating category with name: ${createCategoryDto.name}, type: ${type.name}`,
    );
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        userId: userId,
        categoryTypeNameSnapshot: type.name,
      },
    });
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        // Fetch categories specifically created by this user
        // OR categories with no user (potential defaults - TBD)
        // For MVP, only fetch user-specific ones.
        userId: userId,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(userId: string, id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    // Check if the category belongs to the user (or is a global one if userId is null)
    // For MVP, we only allow access to user's own categories.
    if (category.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this category',
      );
    }

    return category;
  }

  async update(
    userId: string,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.findOne(userId, id);
    let typeName: string | undefined = undefined;

    if (updateCategoryDto.categoryTypeId) {
      const type = await this.prisma.categoryType.findUnique({
        where: { id: updateCategoryDto.categoryTypeId },
      });

      // Only check if the type exists and is not deleted
      if (!type || type.deletedAt) {
        throw new NotFoundException('Category type not found');
      }

      // Skip the ownership check (type.userId !== userId) since category types are global
      typeName = type.name;
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        ...(typeName && { categoryTypeNameSnapshot: typeName }),
      },
    });
  }

  async remove(userId: string, id: string): Promise<Category> {
    // Verify the category exists and belongs to the user
    await this.findOne(userId, id);

    // TODO: Check if category is used in any transactions before deleting?
    // For MVP, allow deletion.
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
