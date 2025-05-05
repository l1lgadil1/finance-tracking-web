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

  private mapToDto = (
    transaction: Transaction & {
      category?: { name: string } | null;
      account?: { name: string } | null;
      fromAccount?: { name: string } | null;
      toAccount?: { name: string } | null;
    },
  ): TransactionResponseDto => ({
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
    categoryName: transaction.category?.name || null,
    accountName: transaction.account?.name || null,
    fromAccountName: transaction.fromAccount?.name || null,
    toAccountName: transaction.toAccount?.name || null,
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
      relatedDebtId,
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
        // Validate relatedDebtId ownership if provided
        relatedDebtId && this.validateDebtOwnership(userId, relatedDebtId),
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
            // Add relatedDebtId if it exists - use explicit spread to avoid type errors
            ...(relatedDebtId ? { relatedDebtId } : {}),
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
          relatedDebtId,
        );

        // 3. If it's a debt repayment, update the status of the related debt
        if (type === 'debt_repay' && relatedDebtId) {
          await tx.transaction.update({
            where: { id: relatedDebtId },
            data: { debtStatus: 'repaid' },
          });
        }

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
    relatedDebtId?: string | null,
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
      case $Enums.TransactionType.debt_give:
        if (!accountId)
          throw new BadRequestException('accountId required for debt_give');
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
        break;
      case $Enums.TransactionType.debt_take:
        if (!accountId)
          throw new BadRequestException('accountId required for debt_take');
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
        if (!accountId) {
          throw new BadRequestException('accountId required for debt_repay');
        }

        // If there's a related debt, check its type to determine the correct balance update
        if (relatedDebtId) {
          const relatedDebt = await tx.transaction.findUnique({
            where: { id: relatedDebtId },
          });

          if (!relatedDebt) {
            throw new BadRequestException('Related debt transaction not found');
          }

          // Debt repayment balance logic depends on the original debt type
          if (relatedDebt.type === 'debt_give') {
            // If repaying a debt that was given, the account balance should increase
            console.log(
              `Repaying debt_give: Increasing account ${accountId} balance by ${amount}`,
            );
            await tx.account.update({
              where: { id: accountId },
              data: { balance: { increment: amount } },
            });
          } else if (relatedDebt.type === 'debt_take') {
            // If repaying a debt that was taken, the account balance should decrease
            console.log(
              `Repaying debt_take: Decreasing account ${accountId} balance by ${amount}`,
            );
            await tx.account.update({
              where: { id: accountId },
              data: { balance: { decrement: amount } },
            });
          } else {
            throw new BadRequestException(
              'Related transaction is not a valid debt type',
            );
          }
        } else {
          // If no related debt (should not happen with proper UI), use default logic
          console.log(
            `WARNING: Debt repayment without related debt ID, using default behavior`,
          );
          await tx.account.update({
            where: { id: accountId },
            data: { balance: { decrement: amount } },
          });
        }
        break;
    }
  }

  async findAll(
    userId: string,
    query: FindTransactionsQueryDto,
  ): Promise<TransactionResponseDto[]> {
    const {
      type,
      profileId,
      accountId,
      categoryId,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount,
      search,
      startDate,
      endDate,
    } = query;

    try {
      // Build the where clause for filtering
      const whereClause: Prisma.TransactionWhereInput = {
        userId,
      };

      // Handle various filters
      if (type) {
        whereClause.type = type as $Enums.TransactionType;
      }

      if (profileId) {
        whereClause.profileId = profileId;
      }

      if (accountId) {
        // For account filter, we need to check multiple fields
        whereClause.OR = [
          { accountId },
          { fromAccountId: accountId },
          { toAccountId: accountId },
        ];
      }

      if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      // Handle date filters (prioritize dateFrom/dateTo over startDate/endDate for backward compatibility)
      if (dateFrom || dateTo || startDate || endDate) {
        whereClause.date = {};

        // Use dateFrom or fall back to startDate
        const effectiveStartDate =
          dateFrom || (startDate ? new Date(startDate) : null);
        if (effectiveStartDate) {
          whereClause.date.gte = effectiveStartDate;
        }

        // Use dateTo or fall back to endDate
        const effectiveEndDate = dateTo || (endDate ? new Date(endDate) : null);
        if (effectiveEndDate) {
          const endDateTime = new Date(effectiveEndDate);
          // Set time to end of day for inclusive filtering
          endDateTime.setHours(23, 59, 59, 999);
          whereClause.date.lte = endDateTime;
        }
      }

      // Handle amount range filters
      if (minAmount !== undefined || maxAmount !== undefined) {
        whereClause.amount = {};

        if (minAmount !== undefined) {
          whereClause.amount.gte = minAmount;
        }

        if (maxAmount !== undefined) {
          whereClause.amount.lte = maxAmount;
        }
      }

      // Handle search filter (search in description and contactName)
      if (search) {
        whereClause.OR = [
          ...(whereClause.OR || []),
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            contactName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      // Query the transactions
      const transactions = await this.prisma.transaction.findMany({
        where: whereClause,
        orderBy: {
          date: 'desc', // Most recent first
        },
        include: {
          category: {
            select: { name: true },
          },
          account: {
            select: { name: true },
          },
        },
      });

      // Map and handle fromAccount and toAccount separately since they're not direct relations
      const enhancedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          // Get fromAccount name if exists
          let fromAccount: { name: string } | null = null;
          if (transaction.fromAccountId) {
            fromAccount = await this.prisma.account.findUnique({
              where: { id: transaction.fromAccountId },
              select: { name: true },
            });
          }

          // Get toAccount name if exists
          let toAccount: { name: string } | null = null;
          if (transaction.toAccountId) {
            toAccount = await this.prisma.account.findUnique({
              where: { id: transaction.toAccountId },
              select: { name: true },
            });
          }

          return {
            ...transaction,
            fromAccount,
            toAccount,
          };
        }),
      );

      return enhancedTransactions.map(this.mapToDto);
    } catch (error) {
      console.error('Error finding transactions:', error);
      throw new InternalServerErrorException('Failed to retrieve transactions');
    }
  }

  async findOne(userId: string, id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true },
        },
        account: {
          select: { name: true },
        },
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

    // Get fromAccount and toAccount names if they exist
    let fromAccount: { name: string } | null = null;
    if (transaction.fromAccountId) {
      fromAccount = await this.prisma.account.findUnique({
        where: { id: transaction.fromAccountId },
        select: { name: true },
      });
    }

    let toAccount: { name: string } | null = null;
    if (transaction.toAccountId) {
      toAccount = await this.prisma.account.findUnique({
        where: { id: transaction.toAccountId },
        select: { name: true },
      });
    }

    const enhancedTransaction = {
      ...transaction,
      fromAccount,
      toAccount,
    };

    return this.mapToDto(enhancedTransaction);
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

  async findActiveDebts(userId: string): Promise<TransactionResponseDto[]> {
    try {
      console.log(`Finding active debts for userId: ${userId}`);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          type: {
            in: ['debt_give', 'debt_take'],
          },
          debtStatus: 'active',
        },
        orderBy: {
          date: 'desc',
        },
        include: {
          category: {
            select: { name: true },
          },
          account: {
            select: { name: true },
          },
        },
      });

      console.log(`Found ${transactions.length} active debts`);

      if (transactions.length > 0) {
        console.log(
          'Sample debt transaction:',
          JSON.stringify(transactions[0], null, 2),
        );
      }

      // Map and handle fromAccount and toAccount separately if needed
      const enhancedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          // Get fromAccount name if exists
          let fromAccount: { name: string } | null = null;
          if (transaction.fromAccountId) {
            fromAccount = await this.prisma.account.findUnique({
              where: { id: transaction.fromAccountId },
              select: { name: true },
            });
          }

          // Get toAccount name if exists
          let toAccount: { name: string } | null = null;
          if (transaction.toAccountId) {
            toAccount = await this.prisma.account.findUnique({
              where: { id: transaction.toAccountId },
              select: { name: true },
            });
          }

          return {
            ...transaction,
            fromAccount,
            toAccount,
          };
        }),
      );

      return enhancedTransactions.map(this.mapToDto);
    } catch (error) {
      console.error('Error finding active debts:', error);
      throw new InternalServerErrorException(
        'An error occurred while finding active debts',
      );
    }
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
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: { categoryType: true },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // Try to get category type name from the category
      let categoryTypeName: string | undefined;

      // First try to get from the snapshot
      if (category.categoryTypeNameSnapshot) {
        categoryTypeName = category.categoryTypeNameSnapshot;
      }
      // Then try to get from the relation
      else if (
        category.categoryType &&
        typeof category.categoryType === 'object'
      ) {
        // Safely access name property if it exists
        const categoryTypeObj = category.categoryType as Record<
          string,
          unknown
        >;
        if (
          categoryTypeObj &&
          'name' in categoryTypeObj &&
          typeof categoryTypeObj.name === 'string'
        ) {
          categoryTypeName = categoryTypeObj.name;
        }
      }

      // Validate category type against transaction type
      if (!this.isCategoryTypeValid(categoryTypeName, transactionType)) {
        throw new BadRequestException(
          `Category type does not match transaction type (${transactionType})`,
        );
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error validating category type');
    }
  }

  private isCategoryTypeValid(
    categoryType: string | undefined,
    transactionType: TransactionType,
  ): boolean {
    if (!categoryType) return false;
    const categoryTypeStr = String(categoryType).toLowerCase();

    switch (transactionType) {
      case 'income':
        return categoryTypeStr === 'income';
      case 'expense':
        return categoryTypeStr === 'expense';
      case 'transfer':
        return true; // Transfers don't require categories
      case 'debt_give':
      case 'debt_take':
      case 'debt_repay':
        return categoryTypeStr === 'debt';
      default:
        return false;
    }
  }

  private async validateDebtOwnership(
    userId: string,
    debtId: string,
  ): Promise<void> {
    const debt = await this.prisma.transaction.findUnique({
      where: { id: debtId },
    });

    if (!debt) {
      throw new NotFoundException(
        `Debt transaction with ID ${debtId} not found`,
      );
    }
    if (debt.userId !== userId) {
      throw new ForbiddenException(
        `Access to debt transaction with ID ${debtId} denied`,
      );
    }

    if (debt.debtStatus !== 'active') {
      throw new BadRequestException('This debt has already been repaid');
    }

    if (!['debt_give', 'debt_take'].includes(debt.type)) {
      throw new BadRequestException('The referenced transaction is not a debt');
    }
  }

  async getStatistics(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{ totalIncome: number; totalExpense: number; balance: number }> {
    try {
      // Build where clause for transaction filtering
      const whereClause: Prisma.TransactionWhereInput = {
        userId,
        // Only include income and expense for basic statistics
        type: {
          in: [$Enums.TransactionType.income, $Enums.TransactionType.expense],
        },
      };

      // Add date filters if provided
      if (startDate || endDate) {
        whereClause.date = {};

        if (startDate) {
          whereClause.date.gte = new Date(startDate);
        }

        if (endDate) {
          const endDateTime = new Date(endDate);
          // Set time to end of day for inclusive filtering
          endDateTime.setHours(23, 59, 59, 999);
          whereClause.date.lte = endDateTime;
        }
      }

      // Query transactions matching the criteria
      const transactions = await this.prisma.transaction.findMany({
        where: whereClause,
        select: {
          type: true,
          amount: true,
        },
      });

      // Calculate totals
      const totalIncome = transactions
        .filter((t) => t.type === $Enums.TransactionType.income)
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = transactions
        .filter((t) => t.type === $Enums.TransactionType.expense)
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = totalIncome - totalExpense;

      return { totalIncome, totalExpense, balance };
    } catch (error) {
      console.error('Error calculating transaction statistics:', error);
      if (error instanceof Date) {
        throw new BadRequestException('Invalid date format');
      }
      throw new InternalServerErrorException(
        'Failed to calculate transaction statistics',
      );
    }
  }
  // ---
}
