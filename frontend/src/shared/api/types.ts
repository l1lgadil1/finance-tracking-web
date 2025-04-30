export type TransactionType = 'income' | 'expense' | 'transfer' | 'debt_give' | 'debt_take' | 'debt_repay';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  type: string;
  userId?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  userId: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  type: string;
  userId: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
  userId: string;
  profileId: string;
  categoryId?: string;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  contactName?: string;
  contactPhone?: string;
  debtStatus?: string;
} 