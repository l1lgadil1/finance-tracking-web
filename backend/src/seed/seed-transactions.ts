import { PrismaClient, TransactionType } from '@prisma/client';

async function seedTransactions() {
  const prisma = new PrismaClient();

  try {
    // Get a user to associate transactions with
    const user = await prisma.user.findFirst();
    if (!user) {
      console.error('No users found in the database. Please seed users first.');
      return;
    }

    // Get a profile to associate transactions with
    const profile = await prisma.profile.findFirst({
      where: { userId: user.id },
    });
    if (!profile) {
      console.error(
        'No profiles found for the user. Please seed profiles first.',
      );
      return;
    }

    // Get accounts to associate transactions with
    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      take: 2,
    });
    if (accounts.length < 2) {
      console.error(
        'Need at least 2 accounts for the user. Please seed accounts first.',
      );
      return;
    }

    // Get categories for income and expense transactions
    const incomeCategory = await prisma.category.findFirst({
      where: {
        userId: user.id,
        categoryType: {
          name: 'income',
        },
      },
    });
    const expenseCategory = await prisma.category.findFirst({
      where: {
        userId: user.id,
        categoryType: {
          name: 'expense',
        },
      },
    });

    if (!incomeCategory || !expenseCategory) {
      console.error(
        'Income and expense categories not found. Please seed categories first.',
      );
      return;
    }

    // Create array of test transactions
    const transactions = [
      // Income transactions
      {
        userId: user.id,
        profileId: profile.id,
        type: TransactionType.income,
        amount: 1000,
        description: 'Salary payment',
        date: new Date(2023, 0, 15), // January 15, 2023
        accountId: accounts[0].id,
        categoryId: incomeCategory.id,
      },
      {
        userId: user.id,
        profileId: profile.id,
        type: TransactionType.income,
        amount: 500,
        description: 'Freelance work',
        date: new Date(2023, 1, 10), // February 10, 2023
        accountId: accounts[0].id,
        categoryId: incomeCategory.id,
      },
      {
        userId: user.id,
        profileId: profile.id,
        type: TransactionType.income,
        amount: 2000,
        description: 'Bonus payment',
        date: new Date(2023, 2, 20), // March 20, 2023
        accountId: accounts[0].id,
        categoryId: incomeCategory.id,
      },

      // Expense transactions
      {
        userId: user.id,
        profileId: profile.id,
        type: TransactionType.expense,
        amount: 200,
        description: 'Grocery shopping',
        date: new Date(2023, 0, 5), // January 5, 2023
        accountId: accounts[0].id,
        categoryId: expenseCategory.id,
      },
      {
        userId: user.id,
        profileId: profile.id,
        type: TransactionType.expense,
        amount: 800,
        description: 'Rent payment',
        date: new Date(2023, 1, 1), // February 1, 2023
        accountId: accounts[0].id,
        categoryId: expenseCategory.id,
      },
      {
        userId: user.id,
        profileId: profile.id,
        type: TransactionType.expense,
        amount: 100,
        description: 'Utilities',
        date: new Date(2023, 1, 15), // February 15, 2023
        accountId: accounts[0].id,
        categoryId: expenseCategory.id,
      },

      // Transfer transactions
      {
        userId: user.id,
        profileId: profile.id,
        type: TransactionType.transfer,
        amount: 500,
        description: 'Transfer to savings',
        date: new Date(2023, 2, 1), // March 1, 2023
        fromAccountId: accounts[0].id,
        toAccountId: accounts[1].id,
      },

      // Debt transactions
      {
        userId: user.id,
        profileId: profile.id,
        type: TransactionType.debt_give,
        amount: 300,
        description: 'Loan to friend',
        date: new Date(2023, 2, 10), // March 10, 2023
        accountId: accounts[0].id,
        contactName: 'John Smith',
        contactPhone: '1234567890',
        debtStatus: 'active',
      },
    ];

    // Create transactions
    for (const transaction of transactions) {
      await prisma.transaction.create({
        data: transaction,
      });
    }

    console.log(`Created ${transactions.length} test transactions.`);
  } catch (error) {
    console.error('Error seeding transactions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
seedTransactions()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seeding complete.');
  });
