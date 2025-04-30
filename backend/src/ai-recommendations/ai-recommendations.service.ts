import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  InsightType,
  TransactionType,
  EXPENSE_THRESHOLDS,
  TIME_PERIODS,
} from '../shared/constants/finance';

export interface AIInsight {
  id: string;
  type: InsightType;
  message: string;
  icon: string;
  userId: string;
  createdAt: string;
}

export interface AIRecommendation {
  insights: AIInsight[];
  tips: string[];
}

const INSIGHT_ICONS = {
  [InsightType.HIGH_EXPENSE]: '📊',
  [InsightType.BUDGET_ALERT]: '⚠️',
  [InsightType.SAVING_OPPORTUNITY]: '💡',
  [InsightType.POSITIVE_TREND]: '🎉',
} as const;

const CATEGORY_KEYWORDS = {
  SUBSCRIPTION: 'subscription',
  DINING: 'dining',
  UTILITY: 'utility',
} as const;

@Injectable()
export class AiRecommendationsService {
  constructor(private prisma: PrismaService) {}

  private async analyzeExpenses(userId: string): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfPrevMonth = new Date(firstDayOfMonth.getTime() - 1);
    const firstDayOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    // Get current and previous month's transactions
    const [currentMonthTransactions, prevMonthTransactions] = await Promise.all(
      [
        this.prisma.transaction.findMany({
          where: {
            userId,
            date: {
              gte: firstDayOfMonth,
              lte: now,
            },
          },
          include: {
            category: true,
          },
        }),
        this.prisma.transaction.findMany({
          where: {
            userId,
            date: {
              gte: firstDayOfPrevMonth,
              lte: lastDayOfPrevMonth,
            },
          },
          include: {
            category: true,
          },
        }),
      ],
    );

    // Calculate total expenses and income
    const currentExpenses = currentMonthTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    const prevExpenses = prevMonthTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const currentIncome = currentMonthTransactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const prevIncome = prevMonthTransactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    // Analyze expenses by category
    const categoryExpenses = currentMonthTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce(
        (acc, t) => {
          const categoryName = t.category?.name || 'Uncategorized';
          acc[categoryName] = (acc[categoryName] || 0) + t.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

    // Find highest expense category
    const highestCategory = Object.entries(categoryExpenses).sort(
      ([, a], [, b]) => b - a,
    )[0];

    if (highestCategory) {
      insights.push({
        id: crypto.randomUUID(),
        type: InsightType.HIGH_EXPENSE,
        message: `Your highest spending category is ${highestCategory[0]} (${highestCategory[1].toFixed(2)})`,
        icon: INSIGHT_ICONS[InsightType.HIGH_EXPENSE],
        userId,
        createdAt: new Date().toISOString(),
      });
    }

    // Check for significant expense increase
    if (
      prevExpenses > 0 &&
      currentExpenses > prevExpenses * EXPENSE_THRESHOLDS.EXPENSE_INCREASE
    ) {
      insights.push({
        id: crypto.randomUUID(),
        type: InsightType.BUDGET_ALERT,
        message: `Your expenses increased by ${(((currentExpenses - prevExpenses) / prevExpenses) * 100).toFixed(0)}% compared to last month`,
        icon: INSIGHT_ICONS[InsightType.BUDGET_ALERT],
        userId,
        createdAt: new Date().toISOString(),
      });
    }

    // Check for saving opportunities
    const subscriptionExpenses = currentMonthTransactions
      .filter((t) =>
        t.category?.name
          ?.toLowerCase()
          .includes(CATEGORY_KEYWORDS.SUBSCRIPTION),
      )
      .reduce((sum, t) => sum + t.amount, 0);

    if (subscriptionExpenses > 0) {
      insights.push({
        id: crypto.randomUUID(),
        type: InsightType.SAVING_OPPORTUNITY,
        message: `You spent ${subscriptionExpenses.toFixed(2)} on subscriptions this month`,
        icon: INSIGHT_ICONS[InsightType.SAVING_OPPORTUNITY],
        userId,
        createdAt: new Date().toISOString(),
      });
    }

    // Check for positive trends
    if (prevIncome > 0 && currentIncome > prevIncome) {
      insights.push({
        id: crypto.randomUUID(),
        type: InsightType.POSITIVE_TREND,
        message: `Your income increased by ${(((currentIncome - prevIncome) / prevIncome) * 100).toFixed(0)}% compared to last month`,
        icon: INSIGHT_ICONS[InsightType.POSITIVE_TREND],
        userId,
        createdAt: new Date().toISOString(),
      });
    }

    return insights;
  }

  private async generateTips(userId: string): Promise<string[]> {
    const tips: string[] = [];

    // Get user's transactions for analysis
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(Date.now() - TIME_PERIODS.DAYS_30),
        },
      },
      include: {
        category: true,
      },
    });

    // Analyze spending patterns
    const hasHighDiningExpenses =
      transactions
        .filter((t) =>
          t.category?.name?.toLowerCase().includes(CATEGORY_KEYWORDS.DINING),
        )
        .reduce((sum, t) => sum + t.amount, 0) > EXPENSE_THRESHOLDS.HIGH_DINING;

    const hasSubscriptions = transactions.some((t) =>
      t.category?.name?.toLowerCase().includes(CATEGORY_KEYWORDS.SUBSCRIPTION),
    );

    const hasUtilityExpenses = transactions.some((t) =>
      t.category?.name?.toLowerCase().includes(CATEGORY_KEYWORDS.UTILITY),
    );

    // Generate relevant tips
    if (hasHighDiningExpenses) {
      tips.push('Consider meal prepping to reduce dining out expenses');
    }

    if (hasSubscriptions) {
      tips.push('Review your subscriptions and cancel unused services');
    }

    if (hasUtilityExpenses) {
      tips.push(
        'Look for ways to reduce utility costs through energy-efficient practices',
      );
    }

    // Add general tips
    tips.push('Set up automatic transfers to your savings account');
    tips.push('Track your daily expenses to identify saving opportunities');
    tips.push(
      'Consider using cash for discretionary spending to better control expenses',
    );

    return tips;
  }

  async getInsights(userId: string): Promise<AIRecommendation> {
    const [insights, tips] = await Promise.all([
      this.analyzeExpenses(userId),
      this.generateTips(userId),
    ]);

    return {
      insights,
      tips,
    };
  }

  async generateInsights(userId: string): Promise<AIRecommendation> {
    return this.getInsights(userId);
  }
}
