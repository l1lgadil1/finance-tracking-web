import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  FindTransactionsQueryDto,
  TransactionType,
  TransactionResponseDto,
  TransactionTypeEnum,
} from './dto/transaction.dto';
import { Prisma, Transaction, $Enums } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  private mapToDto = (transaction: Transaction): TransactionResponseDto => ({
    id: transaction.id,
    userId: transaction.userId,
    type: TransactionTypeEnum.parse(transaction.type),
    amount: transaction.amount,
    description: transaction.description || null,
    date: transaction.date,
    profileId: transaction.profileId,
    categoryId: transaction.categoryId || null,
    accountId: transaction.accountId || null,
    fromAccountId: transaction.fromAccountId || null,
    toAccountId: transaction.toAccountId || null,
    contactName: transaction.contactName || null,
    contactPhone: transaction.contactPhone || null,
    createdAt: transaction.createdAt,
    debtStatus: transaction.debtStatus ?? undefined,
  });

  async create(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const {
      type,
      amount,
      accountId,
      fromAccountId,
      toAccountId,
      profileId,
      categoryId,
      ...rest
    } = createTransactionDto;

    try {
      // Validate all foreign keys first
      await Promise.all([
        profileId && this.validateProfileOwnership(userId, profileId),
        categoryId && this.validateCategoryOwnership(userId, categoryId),
        accountId && this.validateAccountOwnership(userId, accountId),
        fromAccountId && this.validateAccountOwnership(userId, fromAccountId),
        toAccountId && this.validateAccountOwnership(userId, toAccountId),
      ]);

      // If category is provided, validate it matches transaction type
      if (categoryId) {
        await this.validateCategoryType(categoryId, type);
      }

      const transaction = await this.prisma.$transaction(async (tx) => {
        // 1. Create the base transaction record
        const createdTransaction = await tx.transaction.create({
          data: {
            ...rest,
            type: type as $Enums.TransactionType,
            amount,
            userId,
            profileId,
            categoryId,
            accountId,
            fromAccountId,
            toAccountId,
            debtStatus:
              type === 'debt_give' || type === 'debt_take'
                ? 'active'
                : undefined,
          },
        });

        // 2. Update account balances based on type
        await this.updateBalances(
          tx,
          type as $Enums.TransactionType,
          amount,
          accountId,
          fromAccountId,
          toAccountId,
        );

        return createdTransaction;
      });

      return this.mapToDto(transaction);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException('Transaction already exists');
          case 'P2003':
            throw new BadRequestException(
              'Invalid reference to related entity',
            );
          case 'P2025':
            throw new NotFoundException('Referenced record not found');
          default:
            console.error('Prisma error:', error);
            throw new InternalServerErrorException('Database operation failed');
        }
      }
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('Transaction creation failed:', error);
      throw new InternalServerErrorException('Could not create transaction');
    }
  }

  private async updateBalances(
    tx: Prisma.TransactionClient,
    type: $Enums.TransactionType,
    amount: number,
    accountId?: string | null,
    fromAccountId?: string | null,
    toAccountId?: string | null,
  ): Promise<void> {
    switch (type) {
      case $Enums.TransactionType.income:
        if (!accountId)
          throw new BadRequestException('accountId required for income');
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
        break;
      case $Enums.TransactionType.expense:
        if (!accountId)
          throw new BadRequestException('accountId required for expense');
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
        break;
      case $Enums.TransactionType.debt: // Handle both debt_give and debt_take as 'debt'
        if (!accountId)
          throw new BadRequestException('accountId required for debt');
        // Decide increment or decrement based on additional context if needed
        // For now, just increment (customize as needed)
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
        break;
      case $Enums.TransactionType.transfer:
        if (!fromAccountId || !toAccountId)
          throw new BadRequestException(
            'fromAccountId and toAccountId required for transfer',
          );
        await tx.account.update({
          where: { id: fromAccountId },
          data: { balance: { decrement: amount } },
        });
        await tx.account.update({
          where: { id: toAccountId },
          data: { balance: { increment: amount } },
        });
        break;
      case $Enums.TransactionType.debt_repay:
        if (!accountId)
          throw new BadRequestException('accountId required for debt_repay');
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
        break;
    }
  }

  async findAll(
    userId: string,
    query: FindTransactionsQueryDto,
  ): Promise<TransactionResponseDto[]> {
    const { type, profileId, accountId, categoryId, dateFrom, dateTo } = query;

    // Build the where clause type-safely
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(type ? { type: type as $Enums.TransactionType } : {}),
      ...(profileId && { profileId }),
      ...(accountId && { accountId }),
      ...(categoryId && { categoryId }),
      ...(dateFrom &&
        dateTo && {
          date: {
            gte: dateFrom,
            lte: dateTo,
          },
        }),
      ...(!dateTo && dateFrom && { date: { gte: dateFrom } }),
      ...(dateTo && !dateFrom && { date: { lte: dateTo } }),
    };

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        category: true,
      },
    });

    return transactions.map(this.mapToDto);
  }

  async findOne(userId: string, id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`);
    }
    if (transaction.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this transaction',
      );
    }

    return this.mapToDto(transaction);
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    // Verify ownership and existence
    await this.findOne(userId, id);

    // MVP Limitation: Do not recalculate balances on update.
    // Production: Would need complex logic to revert old balance changes and apply new ones.
    const updated = await this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });

    return this.mapToDto(updated);
  }

  async remove(userId: string, id: string): Promise<Transaction> {
    await this.findOne(userId, id); // Verify ownership and existence

    // MVP Limitation: Do not revert balance changes on delete.
    // Production: Would need complex logic to revert balance changes.

    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  // --- Helper validation methods (Placeholder - Implement full checks if needed) ---
  private async validateProfileOwnership(
    userId: string,
    profileId: string,
  ): Promise<void> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    if (!profile || profile.userId !== userId)
      throw new BadRequestException(`Invalid profileId: ${profileId}`);
  }
  private async validateCategoryOwnership(
    userId: string,
    categoryId: string,
  ): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    // Allow null userId for potential global categories? For MVP, require user ownership.
    if (!category || category.userId !== userId)
      throw new BadRequestException(`Invalid categoryId: ${categoryId}`);
  }
  private async validateAccountOwnership(
    userId: string,
    accountId: string,
  ): Promise<void> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account || account.userId !== userId)
      throw new BadRequestException(`Invalid accountId: ${accountId}`);
  }
  private async validateCategoryType(
    categoryId: string,
    transactionType: TransactionType,
  ): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`);
    }

    // Validate category type matches transaction type
    const isValid = this.isCategoryTypeValid(category.type, transactionType);
    if (!isValid) {
      throw new BadRequestException(
        `Category type "${category.type}" is not valid for transaction type "${transactionType}"`,
      );
    }
  }

  private isCategoryTypeValid(
    categoryType: string,
    transactionType: TransactionType,
  ): boolean {
    switch (transactionType) {
      case 'income':
        return categoryType === 'income';
      case 'expense':
        return categoryType === 'expense';
      case 'transfer':
        return true; // Transfers don't require categories
      case 'debt_give':
      case 'debt_take':
      case 'debt_repay':
        return categoryType === 'debt';
      default:
        return false;
    }
  }
  // ---
}
