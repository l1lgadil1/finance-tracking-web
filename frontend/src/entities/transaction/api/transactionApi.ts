import { api } from '@/shared/api/api';
import { Category } from '@/entities/category/api/categoryApi';
import { TransactionType } from '@/shared/constants/finance';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  accountId: string;
  categoryId: string;
  profileId: string;
  category?: Category;
}

export interface TransactionFilters {
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  profileId?: string;
  accountId?: string;
  categoryId?: string;
  includeCategory?: boolean;
}

export const transactionApi = {
  getAll: (filters?: TransactionFilters) => 
    api.get<Transaction[]>('/transactions', { body: filters }),
    
  getById: (id: string) => 
    api.get<Transaction>(`/transactions/${id}`),
    
  create: (data: Omit<Transaction, 'id' | 'category'>) => 
    api.post<Transaction>('/transactions', data),
    
  update: (id: string, data: Partial<Omit<Transaction, 'id' | 'category'>>) => 
    api.put<Transaction>(`/transactions/${id}`, data),
    
  delete: (id: string) => 
    api.delete<{ success: boolean }>(`/transactions/${id}`),
}; 