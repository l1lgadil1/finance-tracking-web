import { api } from '../api';
import { Transaction, TransactionType } from '../types';

// Define transaction filter parameters
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: TransactionType;
  accountId?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

// Define transaction create/update DTOs
export interface TransactionCreateDTO {
  type: TransactionType;
  amount: number;
  description?: string;
  date: string;
  categoryId?: string;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  contactName?: string;
  contactPhone?: string;
}

// TransactionUpdateDTO is just a partial version of TransactionCreateDTO
export type TransactionUpdateDTO = Partial<TransactionCreateDTO>;

// Transactions API service
export const transactionsApi = {
  // Get all transactions with optional filtering
  getAll: (filters?: TransactionFilters) => {
    // Construct query string from filters
    const queryParams = filters
      ? Object.entries(filters)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('&')
      : '';

    const endpoint = `/transactions${queryParams ? `?${queryParams}` : ''}`;
    return api.get<Transaction[]>(endpoint);
  },

  // Get transaction by ID
  getById: (id: string) => api.get<Transaction>(`/transactions/${id}`),

  // Create new transaction
  create: (transaction: TransactionCreateDTO) => api.post<Transaction>('/transactions', transaction),

  // Update existing transaction
  update: (id: string, transaction: TransactionUpdateDTO) => api.patch<Transaction>(`/transactions/${id}`, transaction),

  // Delete transaction
  delete: (id: string) => api.delete<void>(`/transactions/${id}`),

  // Get transaction statistics (summary for dashboard)
  getStatistics: (startDate?: string, endDate?: string) => {
    const queryParams = [];
    if (startDate) queryParams.push(`startDate=${encodeURIComponent(startDate)}`);
    if (endDate) queryParams.push(`endDate=${encodeURIComponent(endDate)}`);
    
    const endpoint = `/transactions/statistics${queryParams.length ? `?${queryParams.join('&')}` : ''}`;
    return api.get<{
      totalIncome: number;
      totalExpense: number;
      balance: number;
    }>(endpoint);
  }
}; 