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
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        userId: userId, // Associate with the current user
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
    // Verify the category exists and belongs to the user
    await this.findOne(userId, id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
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
