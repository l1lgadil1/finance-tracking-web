import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    // Balance is included in DTO and defaults to 0 if not provided
    return this.prisma.account.create({
      data: {
        ...createAccountDto,
        userId: userId, // Associate with the current user
      },
    });
  }

  async findAll(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId }, // Filter by user ID
      orderBy: { name: 'asc' }, // Optional: order by name
    });
  }

  async findOne(userId: string, id: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
    if (account.userId !== userId) {
      // Check if found account belongs to the current user
      throw new ForbiddenException(
        'You do not have permission to access this account',
      );
    }
    return account;
  }

  async update(
    userId: string,
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    // First, verify the account exists and belongs to the user
    await this.findOne(userId, id);

    // Only update the fields present in UpdateAccountDto (just name)
    return this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  async remove(userId: string, id: string): Promise<Account> {
    // First, verify the account exists and belongs to the user
    const account = await this.findOne(userId, id);

    // Prevent deletion if the account has a non-zero balance?
    // Or handle cascading deletes/archiving? For MVP, allow deletion.
    // TODO: Add check for balance != 0 or related transactions if deletion needs restriction.
    if (account.balance !== 0) {
      console.warn(
        `Deleting account ${id} with non-zero balance: ${account.balance}`,
      );
      // Optionally throw an error here if deletion is disallowed
      // throw new ForbiddenException('Cannot delete account with non-zero balance');
    }

    return this.prisma.account.delete({
      where: { id },
    });
  }
}
