'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { FinancialSummaryCard } from '@/shared/ui';
import { DashboardDataProvider } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { GoalModal } from '@/entities/goal/ui/GoalModal';
import { TransactionModal } from '@/features/transaction/ui/TransactionModal';
import { TransactionType } from '@/shared/constants/finance';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { TransactionsSection } from './sections/TransactionsSection';
import { AccountsSection } from './sections/AccountsSection';
import { GoalsSection } from './sections/GoalsSection';
import { AqshaAISection } from './sections/AqshaAISection';
import { ArrowUpDown, DollarSign, TrendingUp, Wallet } from 'lucide-react';

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
    currentMonth: 'Current month'
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
    currentMonth: 'Текущий месяц'
  }
};

interface ModernDashboardProps {
  locale: Locale;
}

export const ModernDashboard: FC<ModernDashboardProps> = ({ locale }) => {
  const t = dashboardTranslations[locale] || dashboardTranslations.en;
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);
  
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

  return (
    <DashboardDataProvider locale={locale}>
      <motion.div
        className="p-4 md:p-6 max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-live="polite"
      >
        {/* Welcome section */}
        <motion.header variants={itemVariants} className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t.welcome}, <span className="text-primary-600 dark:text-primary-400">Ilyas</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t.accessMessage}
          </p>
        </motion.header>

        {/* Financial Summary Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <FinancialSummaryCard 
            title={t.totalBalance}
            value={5280.75}
            subtitle={t.allAccounts}
            icon={<Wallet size={20} />}
            change={{ value: 12.5, positive: true }}
            trendData={[5100, 5150, 5220, 5180, 5240, 5280]}
          />
          
          <FinancialSummaryCard 
            title={t.monthlyIncome}
            value={3500.00}
            subtitle={t.currentMonth}
            icon={<DollarSign size={20} />}
            change={{ value: 500, positive: true }}
            trendData={[2800, 3000, 2900, 3200, 3500]}
          />
          
          <FinancialSummaryCard 
            title={t.monthlyExpenses}
            value={2175.35}
            subtitle={t.currentMonth}
            icon={<ArrowUpDown size={20} />}
            change={{ value: 125.40, positive: false }}
            trendData={[1800, 1950, 2050, 2175]}
          />
          
          <FinancialSummaryCard 
            title={t.netSavings}
            value={1324.65}
            subtitle={t.currentMonth}
            icon={<TrendingUp size={20} />}
            change={{ value: 374.60, positive: true }}
            trendData={[800, 1050, 990, 1250, 1324]}
          />
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
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <h3 className="font-medium text-lg">{t.quickActions}</h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Button 
                    variant="primary" 
                    leftIcon={<span className="text-xl">+</span>} 
                    fullWidth
                    onClick={handleOpenGoalModal}
                    className="h-12 transition-transform duration-150 hover:scale-[1.02]"
                  >
                    {t.addGoal}
                  </Button>
                  <Button 
                    variant="primary" 
                    leftIcon={<span className="text-xl">+</span>} 
                    fullWidth
                    onClick={() => handleOpenTransactionModal(TransactionType.INCOME)}
                    className="h-12 transition-transform duration-150 hover:scale-[1.02] bg-green-500 hover:bg-green-600"
                  >
                    {t.addIncome}
                  </Button>
                  <Button 
                    variant="destructive" 
                    leftIcon={<span className="text-xl">+</span>} 
                    fullWidth
                    onClick={() => handleOpenTransactionModal(TransactionType.EXPENSE)}
                    className="h-12 transition-transform duration-150 hover:scale-[1.02]"
                  >
                    {t.addExpense}
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants} className="transition-all">
              <GoalsSection locale={locale} t={t} />
            </motion.div>
            
            <motion.div variants={itemVariants} className="transition-all">
              <AqshaAISection locale={locale} />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
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
    </DashboardDataProvider>
  );
}; 