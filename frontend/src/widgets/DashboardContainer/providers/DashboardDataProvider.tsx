'use client';

import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import { accountApi, Account } from '@/entities/account/api/accountApi';
import { transactionApi, Transaction } from '@/entities/transaction/api/transactionApi';
import { goalApi, Goal } from '@/entities/goal/api/goalApi';
import { aiApi, AIRecommendation } from '@/entities/ai/api/aiApi';
import { Locale } from '@/shared/lib/i18n';

// Define the dashboard data interface
interface DashboardData {
  accounts: {
    data: Account[];
    loading: boolean;
    error: string | null;
  };
  transactions: {
    data: Transaction[];
    loading: boolean;
    error: string | null;
  };
  goals: {
    data: Goal[];
    loading: boolean;
    error: string | null;
  };
  aiRecommendations: {
    data: AIRecommendation | null;
    loading: boolean;
    error: string | null;
  };
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netSavings: number;
  refresh: () => Promise<void>;
  isLoading: boolean;
  hasErrors: boolean;
}

// Create a context for the dashboard data
const DashboardDataContext = createContext<DashboardData | undefined>(undefined);

// Props for the provider component
interface DashboardDataProviderProps {
  children: ReactNode;
  locale: Locale;
}

// Error messages by locale
const errorMessages = {
  en: {
    accounts: 'Failed to load accounts',
    transactions: 'Failed to load transactions',
    goals: 'Failed to load goals',
    ai: 'Failed to load AI recommendations'
  },
  ru: {
    accounts: 'Не удалось загрузить счета',
    transactions: 'Не удалось загрузить транзакции',
    goals: 'Не удалось загрузить цели',
    ai: 'Не удалось загрузить рекомендации ИИ'
  }
};

// Dashboard data provider component
export const DashboardDataProvider: FC<DashboardDataProviderProps> = ({ children, locale }) => {
  // State for accounts
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState<boolean>(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  
  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  
  // State for goals
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState<boolean>(true);
  const [goalsError, setGoalsError] = useState<string | null>(null);
  
  // State for AI recommendations
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(true);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Get error messages for the current locale
  const errors = errorMessages[locale as keyof typeof errorMessages] || errorMessages.en;
  
  // Financial metrics
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });
  
  const monthlyIncome = thisMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = thisMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netSavings = monthlyIncome - monthlyExpenses;
  
  // Overall loading and error states
  const isLoading = accountsLoading || transactionsLoading || goalsLoading || aiLoading;
  const hasErrors = Boolean(accountsError || transactionsError || goalsError || aiError);
  
  // Fetch dashboard data from the API
  const fetchDashboardData = async () => {
    // Fetch accounts
    setAccountsLoading(true);
    setAccountsError(null);
    try {
      const accountsData = await accountApi.getAll();
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccountsError(errors.accounts);
    } finally {
      setAccountsLoading(false);
    }
    
    // Fetch transactions
    setTransactionsLoading(true);
    setTransactionsError(null);
    try {
      // Get the date for 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Format date to ISO string
      const dateFrom = thirtyDaysAgo.toISOString();
      
      const transactionsData = await transactionApi.getAll({
        dateFrom,
        includeCategory: true
      });
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactionsError(errors.transactions);
    } finally {
      setTransactionsLoading(false);
    }
    
    // Fetch goals
    setGoalsLoading(true);
    setGoalsError(null);
    try {
      const goalsData = await goalApi.getAll();
      setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setGoalsError(errors.goals);
    } finally {
      setGoalsLoading(false);
    }
    
    // Fetch AI recommendations
    setAiLoading(true);
    setAiError(null);
    try {
      const aiData = await aiApi.getInsights();
      setAiRecommendations(aiData);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      setAiError(errors.ai);
    } finally {
      setAiLoading(false);
    }
  };
  
  // Fetch data on component mount and when locale changes
  useEffect(() => {
    fetchDashboardData();
  }, [locale]);
  
  // Create the context value
  const contextValue: DashboardData = {
    accounts: {
      data: accounts,
      loading: accountsLoading,
      error: accountsError
    },
    transactions: {
      data: transactions,
      loading: transactionsLoading,
      error: transactionsError
    },
    goals: {
      data: goals,
      loading: goalsLoading,
      error: goalsError
    },
    aiRecommendations: {
      data: aiRecommendations,
      loading: aiLoading,
      error: aiError
    },
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    netSavings,
    refresh: fetchDashboardData,
    isLoading,
    hasErrors
  };
  
  return (
    <DashboardDataContext.Provider value={contextValue}>
      {children}
    </DashboardDataContext.Provider>
  );
};

// Hook to use the dashboard data
export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
}; 