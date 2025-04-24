import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  FindTransactionsQueryDto,
  TransactionType,
} from './dto/transaction.dto';
import { Prisma, Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
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

    // --- Validate foreign keys belong to user (or handle global categories) ---
    // Simplified for MVP: Assume frontend sends valid IDs belonging to user.
    // Production: Add checks for profile, category, accounts ownership.
    if (profileId) await this.validateProfileOwnership(userId, profileId);
    if (categoryId) await this.validateCategoryOwnership(userId, categoryId);
    if (accountId) await this.validateAccountOwnership(userId, accountId);
    if (fromAccountId)
      await this.validateAccountOwnership(userId, fromAccountId);
    if (toAccountId) await this.validateAccountOwnership(userId, toAccountId);
    // --- End Validation ---

    try {
      return await this.prisma.$transaction(async (tx) => {
        let createdTransaction: Transaction;

        // 1. Create the base transaction record
        createdTransaction = await tx.transaction.create({
          data: {
            ...rest,
            type,
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
          type,
          amount,
          accountId,
          fromAccountId,
          toAccountId,
        );

        return createdTransaction;
      });
    } catch (error) {
      console.error('Transaction creation failed:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors (e.g., foreign key constraint)
      }
      // Rethrow specific errors or a generic one
      throw new InternalServerErrorException('Could not create transaction');
    }
  }

  private async updateBalances(
    tx: Prisma.TransactionClient,
    type: TransactionType,
    amount: number,
    accountId?: string | null,
    fromAccountId?: string | null,
    toAccountId?: string | null,
  ): Promise<void> {
    switch (type) {
      case 'income':
      case 'debt_take': // Взяли в долг -> деньги пришли на счет
        if (!accountId)
          throw new BadRequestException(
            'accountId required for income/debt_take',
          );
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
        break;
      case 'expense':
      case 'debt_give': // Дали в долг -> деньги ушли со счета
        if (!accountId)
          throw new BadRequestException(
            'accountId required for expense/debt_give',
          );
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
        break;
      case 'transfer':
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
      case 'debt_repay':
        // Assumes amount is positive. Who repays? Depends on context.
        // For MVP: Assume the specified accountId is the one *receiving* the repayment (if we took debt)
        // OR the one *sending* the repayment (if we gave debt).
        // Let's assume accountId is the account being credited/debited for the repayment action.
        // Simple approach: Just update the specified account.
        // More complex: Link to original debt and determine direction.
        if (!accountId)
          throw new BadRequestException('accountId required for debt_repay');
        // Example: If accountId represents the account making the repayment (paying back debt they took)
        // await tx.account.update({ where: { id: accountId }, data: { balance: { decrement: amount } } });
        // Example: If accountId represents the account receiving repayment (getting back money they lent)
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
        // TODO: Refine debt_repay logic based on clearer requirements if needed.
        break;
    }
  }

  async findAll(
    userId: string,
    query: FindTransactionsQueryDto,
  ): Promise<Transaction[]> {
    const { type, profileId, accountId, categoryId, dateFrom, dateTo } = query;
    const where: Prisma.TransactionWhereInput = {
      userId: userId,
      ...(type && { type }),
      ...(profileId && { profileId }),
      ...(accountId && { accountId }),
      ...(categoryId && { categoryId }),
      ...(dateFrom && { date: { gte: dateFrom } }),
      ...(dateTo && { date: { lte: dateTo } }),
      // Handle date range query
      ...(dateFrom && dateTo && { date: { gte: dateFrom, lte: dateTo } }),
    };

    return this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' }, // Default order by date descending
      // Add includes for related data if needed in response
      // include: { account: true, category: true, profile: true }
    });
  }

  async findOne(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      // include: { account: true, category: true, profile: true }, // Optional include
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`);
    }
    if (transaction.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this transaction',
      );
    }
    return transaction;
  }

  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const existingTransaction = await this.findOne(userId, id); // Verify ownership and existence

    // MVP Limitation: Do not recalculate balances on update.
    // Production: Would need complex logic to revert old balance changes and apply new ones.

    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
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
  // ---
}
