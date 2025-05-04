import { create } from 'zustand';
import { Transaction } from '@/shared/api/types';
import { transactionsApi, TransactionFilters, TransactionCreateDTO, TransactionUpdateDTO } from '@/shared/api/transactions';

interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface TransactionState {
  // Data
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  statistics: TransactionStats;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error states
  error: string | null;
  
  // Filters
  filters: TransactionFilters;
  
  // UI state
  displayMode: 'compact' | 'detailed';
  groupByDate: boolean;
  showBalance: boolean;
  
  // Actions
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  fetchTransactionById: (id: string) => Promise<void>;
  createTransaction: (data: TransactionCreateDTO) => Promise<Transaction>;
  updateTransaction: (id: string, data: TransactionUpdateDTO) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchStatistics: (startDate?: string, endDate?: string) => Promise<void>;
  
  // UI actions
  setFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
  setDisplayMode: (mode: 'compact' | 'detailed') => void;
  setGroupByDate: (groupByDate: boolean) => void;
  setShowBalance: (showBalance: boolean) => void;
}

// Default filters
const defaultFilters: TransactionFilters = {
  startDate: undefined,
  endDate: undefined,
  categoryId: undefined,
  type: undefined,
  accountId: undefined,
  minAmount: undefined,
  maxAmount: undefined,
  search: undefined
};

// Default statistics
const defaultStats: TransactionStats = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // Initial state
  transactions: [],
  currentTransaction: null,
  statistics: defaultStats,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  filters: { ...defaultFilters },
  displayMode: 'detailed',
  groupByDate: true,
  showBalance: true,
  
  // Actions
  fetchTransactions: async (filters) => {
    const currentFilters = filters || get().filters;
    
    try {
      set({ isLoading: true, error: null });
      const transactions = await transactionsApi.getAll(currentFilters);
      set({ 
        transactions,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  
  fetchTransactionById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const transaction = await transactionsApi.getById(id);
      set({ 
        currentTransaction: transaction,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transaction details';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  
  createTransaction: async (data) => {
    try {
      set({ isCreating: true, error: null });
      const newTransaction = await transactionsApi.create(data);
      
      // Update the transactions list with the new transaction
      set((state) => ({ 
        transactions: [newTransaction, ...state.transactions],
        isCreating: false
      }));
      
      return newTransaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create transaction';
      set({ isCreating: false, error: errorMessage });
      throw error;
    }
  },
  
  updateTransaction: async (id, data) => {
    try {
      set({ isUpdating: true, error: null });
      const updatedTransaction = await transactionsApi.update(id, data);
      
      // Update the transaction in the list
      set((state) => ({ 
        transactions: state.transactions.map(t => 
          t.id === id ? updatedTransaction : t
        ),
        currentTransaction: state.currentTransaction?.id === id 
          ? updatedTransaction 
          : state.currentTransaction,
        isUpdating: false
      }));
      
      return updatedTransaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update transaction';
      set({ isUpdating: false, error: errorMessage });
      throw error;
    }
  },
  
  deleteTransaction: async (id) => {
    try {
      set({ isDeleting: true, error: null });
      await transactionsApi.delete(id);
      
      // Remove the transaction from the list
      set((state) => ({ 
        transactions: state.transactions.filter(t => t.id !== id),
        isDeleting: false,
        currentTransaction: state.currentTransaction?.id === id 
          ? null 
          : state.currentTransaction
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete transaction';
      set({ isDeleting: false, error: errorMessage });
      throw error;
    }
  },
  
  fetchStatistics: async (startDate, endDate) => {
    try {
      set({ isLoading: true, error: null });
      const stats = await transactionsApi.getStatistics(startDate, endDate);
      set({ 
        statistics: stats,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch statistics';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  
  // UI actions
  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters
      }
    }));
  },
  
  resetFilters: () => {
    set({
      filters: { ...defaultFilters }
    });
  },
  
  setDisplayMode: (mode) => {
    set({ displayMode: mode });
  },
  
  setGroupByDate: (groupByDate) => {
    set({ groupByDate });
  },
  
  setShowBalance: (showBalance) => {
    set({ showBalance });
  }
})); 