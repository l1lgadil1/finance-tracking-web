'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { FinancialSummaryCard } from '@/shared/ui';
import { DashboardDataProvider, useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { GoalModal } from '@/entities/goal/ui/GoalModal';
import { TransactionModal } from '@/features/transaction/ui/TransactionModal';
import { TransactionType } from '@/shared/constants/finance';
import { AnalyticsSection } from '../sections/AnalyticsSection';
import { TransactionsSection } from '../sections/TransactionsSection';
import { AccountsSection } from '../sections/AccountsSection';
import { GoalsSection } from '../sections/GoalsSection';
import { AqshaAISection } from '../sections/AqshaAISection';
import { QuickActionsSection } from '../sections/QuickActionsSection';
import { NotificationsSection } from '../sections/NotificationsSection';
import { ArrowUpDown, DollarSign, TrendingUp, Wallet, RefreshCw } from 'lucide-react';

// Define translations for the dashboard
const dashboardTranslations = {
  en: {
    welcome: 'Welcome',
    accessMessage: 'Access & manage your account and transactions efficiently.',
    goals: 'Goals',
    viewAll: 'View all',
    recentTransactions: 'Recent transactions',
    transaction: 'Transaction',
    amount: 'Amount',
    status: 'Status',
    date: 'Date',
    category: 'Category',
    quickActions: 'Quick Actions',
    income: 'Income',
    expense: 'Expense',
    purpose: 'Overview of your current financial status.',
    addGoal: 'Add Goal',
    addIncome: 'Add Income',
    addExpense: 'Add Expense',
    financialInsights: 'Financial Insights',
    totalBalance: 'Total Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    netSavings: 'Net Savings',
    allAccounts: 'Across all accounts',
    currentMonth: 'Current month',
    loading: 'Loading...',
    error: 'Error loading data',
    refresh: 'Refresh'
  },
  ru: {
    welcome: 'Добро пожаловать',
    accessMessage: 'Удобно управляйте своим счетом и транзакциями.',
    goals: 'Цели',
    viewAll: 'Все',
    recentTransactions: 'Недавние транзакции',
    transaction: 'Транзакция',
    amount: 'Сумма',
    status: 'Статус',
    date: 'Дата',
    category: 'Категория',
    quickActions: 'Быстрые действия',
    income: 'Доход',
    expense: 'Расход',
    purpose: 'Обзор текущего состояния финансов.',
    addGoal: 'Добавить цель',
    addIncome: 'Добавить доход',
    addExpense: 'Добавить расход',
    financialInsights: 'Финансовые показатели',
    totalBalance: 'Общий баланс',
    monthlyIncome: 'Месячный доход',
    monthlyExpenses: 'Месячные расходы',
    netSavings: 'Чистые сбережения',
    allAccounts: 'По всем счетам',
    currentMonth: 'Текущий месяц',
    loading: 'Загрузка...',
    error: 'Ошибка загрузки данных',
    refresh: 'Обновить'
  }
};

interface ModernDashboardProps {
  locale: Locale;
}

// Dashboard wrapper component that provides data context
export const ModernDashboard: FC<ModernDashboardProps> = ({ locale }) => {
  return (
    <DashboardDataProvider locale={locale}>
      <DashboardContent locale={locale} />
    </DashboardDataProvider>
  );
};

// Inner component that consumes the data context
const DashboardContent: FC<ModernDashboardProps> = ({ locale }) => {
  const t = dashboardTranslations[locale] || dashboardTranslations.en;
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);
  
  // Get data from the dashboard data provider
  const { 
    totalBalance, 
    monthlyIncome, 
    monthlyExpenses, 
    netSavings, 
    isLoading, 
    hasErrors,
    refresh
  } = useDashboardData();
  
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const handleOpenGoalModal = () => {
    setIsGoalModalOpen(true);
  };

  const handleCloseGoalModal = () => {
    setIsGoalModalOpen(false);
  };

  const handleOpenTransactionModal = (type: TransactionType) => {
    setTransactionType(type);
    setIsTransactionModalOpen(true);
  };

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    if (action === 'addGoal') {
      handleOpenGoalModal();
    } else if (action === 'addIncome') {
      handleOpenTransactionModal(TransactionType.INCOME);
    } else if (action === 'addExpense') {
      handleOpenTransactionModal(TransactionType.EXPENSE);
    } else if (action === 'addTransfer') {
      handleOpenTransactionModal(TransactionType.TRANSFER);
    }
    // Other actions can be handled as needed
  };

  return (
    <motion.div
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-live="polite"
    >
      {/* Welcome section with refresh button */}
      <motion.header variants={itemVariants} className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t.welcome}, <span className="text-primary-600 dark:text-primary-400">Ilyas</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t.accessMessage}
          </p>
        </div>
        <button 
          onClick={() => refresh()} 
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-accent transition-colors duration-200"
          title={t.refresh}
          aria-label={t.refresh}
        >
          <RefreshCw size={20} className={`text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </motion.header>

      {/* Financial Summary Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isLoading ? (
          // Loading state
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-4 h-24 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2.5"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </>
        ) : hasErrors ? (
          // Error state
          <div className="col-span-full p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200">
            <p>{t.error}</p>
          </div>
        ) : (
          // Data loaded successfully
          <>
            <FinancialSummaryCard 
              title={t.totalBalance}
              value={totalBalance}
              subtitle={t.allAccounts}
              icon={<Wallet size={20} />}
              trendData={[]} // Let's not use trend data for real amounts
            />
            
            <FinancialSummaryCard 
              title={t.monthlyIncome}
              value={monthlyIncome}
              subtitle={t.currentMonth}
              icon={<DollarSign size={20} />}
              trendData={[]}
            />
            
            <FinancialSummaryCard 
              title={t.monthlyExpenses}
              value={monthlyExpenses}
              subtitle={t.currentMonth}
              icon={<ArrowUpDown size={20} />}
              trendData={[]}
            />
            
            <FinancialSummaryCard 
              title={t.netSavings}
              value={netSavings}
              subtitle={t.currentMonth}
              icon={<TrendingUp size={20} />}
              trendData={[]}
            />
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left column - 8/12 on large screens */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          <motion.div variants={itemVariants} className="transition-all">
            <AnalyticsSection locale={locale} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="transition-all">
            <AccountsSection locale={locale} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="transition-all">
            <TransactionsSection locale={locale} t={t} />
          </motion.div>
        </div>

        {/* Right column - 4/12 on large screens */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          <motion.div variants={itemVariants} className="transition-all">
            <QuickActionsSection 
              locale={locale} 
              onActionClick={handleQuickAction}
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="transition-all">
            <NotificationsSection locale={locale} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="transition-all">
            <GoalsSection locale={locale} t={t} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="transition-all">
            <AqshaAISection locale={locale} />
          </motion.div>
        </div>
      </div>
      
      {/* Global Goal Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={handleCloseGoalModal}
        locale={locale}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        locale={locale}
        defaultTransactionType={transactionType}
      />
    </motion.div>
  );
}; 