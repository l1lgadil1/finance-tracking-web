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
  refresh: () => void;
}

// Create a context for the dashboard data
const DashboardDataContext = createContext<DashboardData | undefined>(undefined);

// Props for the provider component
interface DashboardDataProviderProps {
  children: ReactNode;
  locale: Locale;
}

// Dashboard data provider component
export const DashboardDataProvider: FC<DashboardDataProviderProps> = ({ children }) => {
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
      setAccountsError('Failed to load accounts');
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
      setTransactionsError('Failed to load transactions');
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
      setGoalsError('Failed to load goals');
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
      setAiError('Failed to load AI recommendations');
    } finally {
      setAiLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
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
    refresh: fetchDashboardData
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