export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
  DEBT = 'debt',
  DEBT_REPAY = 'debt_repay',
}

export enum InsightType {
  HIGH_EXPENSE = 'highExpense',
  SAVING_OPPORTUNITY = 'savingOpportunity',
  BUDGET_ALERT = 'budgetAlert',
  POSITIVE_TREND = 'positiveTrend',
}

export const EXPENSE_THRESHOLDS = {
  HIGH_DINING: 200,
  EXPENSE_INCREASE: 1.2, // 20% increase
} as const;

export const TIME_PERIODS = {
  DAYS_30: 30 * 24 * 60 * 60 * 1000,
  DAYS_7: 7,
  MONTHS_6: 6,
  MONTHS_12: 12,
} as const;
