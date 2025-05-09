import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    return this.prisma.profile.create({
      data: {
        ...createProfileDto,
        userId: userId, // Associate with the current user
      },
    });
  }

  async findAll(userId: string): Promise<Profile[]> {
    return this.prisma.profile.findMany({
      where: { userId }, // Filter by user ID
      orderBy: { createdAt: 'asc' }, // Optional: order by creation date
    });
  }

  async findOne(userId: string, id: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile || profile.userId !== userId) {
      // Check if found and belongs to the current user
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
    return profile;
  }

  async update(
    userId: string,
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    // First, verify the profile exists and belongs to the user
    await this.findOne(userId, id);

    return this.prisma.profile.update({
      where: { id }, // No need to check userId here again due to findOne check
      data: updateProfileDto,
    });
  }

  async remove(userId: string, id: string): Promise<Profile> {
    // First, verify the profile exists and belongs to the user
    await this.findOne(userId, id);

    // Consider implications: deleting a profile might require handling related transactions.
    // For MVP, we just delete the profile.
    // TODO: Add logic to handle/prevent deletion if profile has associated transactions?
    return this.prisma.profile.delete({
      where: { id },
    });
  }

  /**
   * Reset a profile to initial state
   * This deletes all transactions, user categories, and resets accounts to default
   */
  async resetProfile(userId: string, profileId: string): Promise<Profile> {
    // Verify the profile exists and belongs to the user
    const profile = await this.findOne(userId, profileId);

    // Use a transaction to ensure all operations are atomic
    return this.prisma.$transaction(async (tx) => {
      // 1. Delete all transactions for this profile
      await tx.transaction.deleteMany({
        where: {
          profileId: profileId,
          userId: userId,
        },
      });

      // 2. Delete all custom categories (non-system categories)
      await tx.category.deleteMany({
        where: {
          userId: userId,
          categoryType: {
            isSystem: false,
          },
        },
      });

      // 3. Reset accounts to default state (keep accounts but set balance to 0)
      await tx.account.updateMany({
        where: { userId: userId },
        data: { balance: 0 },
      });

      // 4. Delete all goals
      await tx.goal.deleteMany({
        where: { userId: userId },
      });

      // 5. Create default categories
      // Get system category types
      const incomeType = await tx.categoryType.findFirst({
        where: {
          isSystem: true,
          name: 'Income',
        },
      });

      const expenseType = await tx.categoryType.findFirst({
        where: {
          isSystem: true,
          name: 'Expense',
        },
      });

      // Create default income categories
      if (incomeType) {
        await tx.category.createMany({
          data: [
            {
              name: 'Salary',
              icon: 'money-bill',
              userId: userId,
              categoryTypeId: incomeType.id,
            },
            {
              name: 'Freelance',
              icon: 'laptop',
              userId: userId,
              categoryTypeId: incomeType.id,
            },
            {
              name: 'Investments',
              icon: 'chart-line',
              userId: userId,
              categoryTypeId: incomeType.id,
            },
            {
              name: 'Gifts',
              icon: 'gift',
              userId: userId,
              categoryTypeId: incomeType.id,
            },
          ],
          skipDuplicates: true,
        });
      }

      // Create default expense categories
      if (expenseType) {
        await tx.category.createMany({
          data: [
            {
              name: 'Food',
              icon: 'utensils',
              userId: userId,
              categoryTypeId: expenseType.id,
            },
            {
              name: 'Transport',
              icon: 'car',
              userId: userId,
              categoryTypeId: expenseType.id,
            },
            {
              name: 'Shopping',
              icon: 'shopping-bag',
              userId: userId,
              categoryTypeId: expenseType.id,
            },
            {
              name: 'Bills',
              icon: 'file-invoice',
              userId: userId,
              categoryTypeId: expenseType.id,
            },
            {
              name: 'Entertainment',
              icon: 'film',
              userId: userId,
              categoryTypeId: expenseType.id,
            },
            {
              name: 'Health',
              icon: 'medkit',
              userId: userId,
              categoryTypeId: expenseType.id,
            },
          ],
          skipDuplicates: true,
        });
      }

      return profile;
    });
  }
}
