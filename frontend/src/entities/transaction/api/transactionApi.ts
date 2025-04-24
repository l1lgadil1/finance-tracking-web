import { api } from '@/shared/api/api';

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'debt' | 'debt_repay';
  amount: number;
  description: string;
  date: string;
  accountId: string;
  categoryId: string;
  profileId: string;
}

export interface TransactionFilters {
  type?: Transaction['type'];
  dateFrom?: string;
  dateTo?: string;
  profileId?: string;
  accountId?: string;
  categoryId?: string;
}

export const transactionApi = {
  getAll: (filters?: TransactionFilters) => 
    api.get<Transaction[]>('/transactions', { body: filters }),
    
  getById: (id: string) => 
    api.get<Transaction>(`/transactions/${id}`),
    
  create: (data: Omit<Transaction, 'id'>) => 
    api.post<Transaction>('/transactions', data),
    
  update: (id: string, data: Partial<Omit<Transaction, 'id'>>) => 
    api.put<Transaction>(`/transactions/${id}`, data),
    
  delete: (id: string) => 
    api.delete<{ success: boolean }>(`/transactions/${id}`),
}; 