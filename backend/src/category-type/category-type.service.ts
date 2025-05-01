import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryTypeDto } from './dto/create-category-type.dto';
import { UpdateCategoryTypeDto } from './dto/update-category-type.dto';
import { CategoryType } from '@prisma/client';

@Injectable()
export class CategoryTypeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Fetches all system category types
   * This is a global method that doesn't require authentication
   */
  async findAllSystem(): Promise<CategoryType[]> {
    // Check if any system types exist at all
    const systemTypes = await this.prisma.categoryType.findMany({
      where: {
        isSystem: true,
      },
    });

    // If no system types exist, create them with a system user ID
    if (systemTypes.length === 0) {
      await this.createDefaultCategoryTypes();

      // Fetch the newly created system types
      return this.prisma.categoryType.findMany({
        where: {
          isSystem: true,
          deletedAt: null,
        },
        orderBy: { name: 'asc' },
      });
    }

    // Return all active system types
    return this.prisma.categoryType.findMany({
      where: {
        isSystem: true,
        deletedAt: null,
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Find a specific category type by ID
   * This is a global method that doesn't require authentication
   */
  async findOneById(id: string): Promise<CategoryType> {
    const type = await this.prisma.categoryType.findUnique({
      where: { id },
    });

    if (!type || type.deletedAt !== null) {
      throw new NotFoundException('Category type not found');
    }

    return type;
  }

  /**
   * Creates the default system category types
   * This is used internally when no system types exist
   */
  private async createDefaultCategoryTypes(): Promise<void> {
    console.log('Creating default system category types');

    // Get or create a system user
    let systemUserId = process.env.SYSTEM_USER_ID;

    if (!systemUserId) {
      // Find any user to associate the types with
      const anyUser = await this.prisma.user.findFirst();

      if (anyUser) {
        systemUserId = anyUser.id;
      } else {
        throw new Error(
          'No users exist in the system to associate with default category types',
        );
      }
    }

    // Create all system category types
    await this.prisma.categoryType.createMany({
      data: [
        { name: 'Income', userId: systemUserId, isSystem: true },
        { name: 'Expense', userId: systemUserId, isSystem: true },
        { name: 'Transfer', userId: systemUserId, isSystem: true },
        { name: 'Gave Debt', userId: systemUserId, isSystem: true },
        { name: 'Took Debt', userId: systemUserId, isSystem: true },
        { name: 'Repay Debt', userId: systemUserId, isSystem: true },
      ],
      skipDuplicates: true,
    });
  }

  // The methods below are kept for internal use but are no longer exposed via the controller

  /**
   * @deprecated Use findAllSystem() instead
   */
  async findAll(userId: string) {
    // First check if the user has any system category types
    const systemTypes = await this.prisma.categoryType.findMany({
      where: {
        userId,
        isSystem: true,
      },
    });

    // If no system types exist for this user, create them
    if (systemTypes.length === 0) {
      await this.ensureSystemCategoryTypes(userId);
    }

    // Return all active system types for the user
    return await this.prisma.categoryType.findMany({
      where: {
        userId,
        deletedAt: null,
        isSystem: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * @deprecated Use findOneById() instead
   */
  async findOne(userId: string, id: string) {
    const type = await this.prisma.categoryType.findUnique({ where: { id } });
    if (!type || type.userId !== userId)
      throw new NotFoundException('Category type not found');
    return type;
  }

  /**
   * @deprecated Use createDefaultCategoryTypes() instead
   */
  async ensureSystemCategoryTypes(userId: string) {
    console.log(`Creating system category types for user ${userId}`);
    // Create all system types for this user
    await this.prisma.categoryType.createMany({
      data: [
        { name: 'Income', userId, isSystem: true },
        { name: 'Expense', userId, isSystem: true },
        { name: 'Transfer', userId, isSystem: true },
        { name: 'Gave Debt', userId, isSystem: true },
        { name: 'Took Debt', userId, isSystem: true },
        { name: 'Repay Debt', userId, isSystem: true },
      ],
      skipDuplicates: true,
    });
  }

  async create(userId: string, dto: CreateCategoryTypeDto) {
    // Only for internal use (system initialization)
    return await this.prisma.categoryType.create({
      data: { ...dto, userId },
    });
  }

  async update(userId: string, id: string, dto: UpdateCategoryTypeDto) {
    // This method is kept for internal use but is not exposed publicly
    const categoryType = await this.findOne(userId, id);

    // Prevent modification of system category type names
    if (categoryType.isSystem && dto.name && dto.name !== categoryType.name) {
      throw new ForbiddenException(
        'System category type names cannot be modified',
      );
    }

    return await this.prisma.categoryType.update({
      where: { id },
      data: { ...dto },
    });
  }

  async softDelete(userId: string, id: string) {
    // This method is kept for internal use but is not exposed publicly
    const categoryType = await this.findOne(userId, id);

    // Prevent deletion of system category types
    if (categoryType.isSystem) {
      throw new ForbiddenException('System category types cannot be deleted');
    }

    return await this.prisma.categoryType.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
