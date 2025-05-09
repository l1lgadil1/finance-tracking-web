import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { UpdateProfileDto } from './auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      // Use a fixed value of 10 for salt rounds
      const saltRounds = 10;
      console.log('Using fixed salt rounds:', saltRounds);

      // Generate the hash with proper error handling
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      console.log('Password successfully hashed');

      return this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error('Error during password hashing:', error);
      throw error;
    }
  }

  async update(userId: string, updateData: UpdateProfileDto): Promise<User> {
    // If email is being updated, check if it's already in use by another user
    if (updateData.email) {
      const existingUser = await this.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update the user
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Deletes a user account and all associated data
   */
  async deleteUser(userId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Delete all user-related data in the correct order to avoid foreign key constraints

      // 1. Delete all transactions
      await tx.transaction.deleteMany({
        where: { userId },
      });

      // 2. Delete all categories (created by this user)
      await tx.category.deleteMany({
        where: { userId },
      });

      // 3. Delete all accounts
      await tx.account.deleteMany({
        where: { userId },
      });

      // 4. Delete all profiles
      await tx.profile.deleteMany({
        where: { userId },
      });

      // 5. Delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });
  }

  /**
   * Exports all user data in the specified format
   */
  async exportUserData(
    userId: string,
    format: 'json' | 'csv',
  ): Promise<{ data: any; format: string }> {
    // Fetch all user data
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isPremium: true,
        createdAt: true,
        // Don't include password
        profiles: {
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
          },
        },
        accounts: {
          select: {
            id: true,
            name: true,
            balance: true,
            createdAt: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            icon: true,
            categoryType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
            description: true,
            amount: true,
            date: true,
            categoryId: true,
            accountId: true,
            profileId: true,
            createdAt: true,
          },
        },
      },
    });

    if (format === 'json') {
      return {
        data: user,
        format: 'application/json',
      };
    } else {
      // For CSV format, we need to flatten the data
      const csvData = this.convertToCSV(user);
      return {
        data: csvData,
        format: 'text/csv',
      };
    }
  }

  /**
   * Converts nested user data to CSV format
   */
  private convertToCSV(userData: any): {
    transactions: string;
    accounts: string;
    profiles: string;
    categories: string;
  } {
    // Helper function to convert array of objects to CSV
    const arrayToCSV = (data: any[], headers: string[]): string => {
      if (!data || !data.length) return '';

      const headerRow = headers.join(',');
      const rows = data.map((item) =>
        headers
          .map((header) => {
            const value = this.getNestedValue(item, header);
            return typeof value === 'string'
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(','),
      );

      return [headerRow, ...rows].join('\n');
    };

    // Create CSV data for each entity type
    return {
      transactions: arrayToCSV(userData.transactions || [], [
        'id',
        'description',
        'amount',
        'date',
        'categoryId',
        'accountId',
        'profileId',
        'createdAt',
      ]),
      accounts: arrayToCSV(userData.accounts || [], [
        'id',
        'name',
        'balance',
        'createdAt',
      ]),
      profiles: arrayToCSV(userData.profiles || [], [
        'id',
        'name',
        'type',
        'createdAt',
      ]),
      categories: arrayToCSV(
        (userData.categories || []).map((cat) => ({
          ...cat,
          categoryTypeName: cat.categoryType?.name || '',
        })),
        ['id', 'name', 'icon', 'categoryTypeName'],
      ),
    };
  }

  /**
   * Safely gets a nested value from an object using a dot-notation path
   */
  private getNestedValue(obj: any, path: string): any {
    if (!obj) return null;

    const keys = path.split('.');
    return keys.reduce(
      (o, key) => (o && o[key] !== undefined ? o[key] : null),
      obj,
    );
  }
}
