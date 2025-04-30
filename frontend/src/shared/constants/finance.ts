export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
  DEBT = 'debt',
  DEBT_REPAY = 'debt_repay',
}

export enum ChartPeriod {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum InsightType {
  HIGH_EXPENSE = 'highExpense',
  SAVING_OPPORTUNITY = 'savingOpportunity',
  BUDGET_ALERT = 'budgetAlert',
  POSITIVE_TREND = 'positiveTrend',
}

export const CHART_COLORS = {
  INCOME: '#0073ff',
  EXPENSE: '#ef4444',
  PRIMARY: {
    300: 'bg-primary-300',
    400: 'bg-primary-400',
    500: 'bg-primary-500',
    600: 'bg-primary-600',
    700: 'bg-primary-700',
  },
} as const;

export const TIME_PERIODS = {
  DAYS_30: 30 * 24 * 60 * 60 * 1000,
  DAYS_7: 7,
  MONTHS_6: 6,
  MONTHS_12: 12,
} as const;

export const EXPENSE_THRESHOLDS = {
  HIGH_DINING: 200,
  EXPENSE_INCREASE: 1.2, // 20% increase
} as const;

export const DATE_FORMATS = {
  WEEKDAY_SHORT: { weekday: 'short' } as const,
  MONTH_SHORT: { month: 'short' } as const,
} as const; 