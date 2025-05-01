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
    // Fetch the account type and validate ownership
    const type = await this.prisma.accountType.findUnique({
      where: { id: createAccountDto.accountTypeId },
    });
    if (!type || type.userId !== userId || type.deletedAt) {
      throw new NotFoundException('Account type not found');
    }
    return this.prisma.account.create({
      data: {
        ...createAccountDto,
        userId: userId,
        accountTypeNameSnapshot: type.name,
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
    await this.findOne(userId, id);
    let typeName: string | undefined = undefined;
    if (updateAccountDto.accountTypeId) {
      const type = await this.prisma.accountType.findUnique({
        where: { id: updateAccountDto.accountTypeId },
      });
      if (!type || type.userId !== userId || type.deletedAt) {
        throw new NotFoundException('Account type not found');
      }
      typeName = type.name;
    }
    return this.prisma.account.update({
      where: { id },
      data: {
        ...updateAccountDto,
        ...(typeName && { accountTypeNameSnapshot: typeName }),
      },
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
