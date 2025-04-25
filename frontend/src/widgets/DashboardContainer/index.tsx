'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { DashboardDataProvider } from './providers/DashboardDataProvider';
import { OverviewSection } from './sections/OverviewSection';
import { AccountsSection } from './sections/AccountsSection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { GoalsSection } from './sections/GoalsSection';
import { TransactionsSection } from './sections/TransactionsSection';
import { AqshaAISection } from './sections/AqshaAISection';

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
    purpose: 'Purpose: overview of your current financial status.',
    blocks: 'Blocks:',
    balance: 'Balance of all accounts (sum of income - expenses)',
    analytics: 'Brief analytics: income/expense graph for the month',
    recentTxs: 'Recent transactions (last 5-10)',
    tips: 'Goals/notifications/tips from AI assistant',
    quickActionsTip: 'Quick actions: +Income, +Expense'
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
    purpose: 'Цель: обзор текущего состояния финансов.',
    blocks: 'Блоки:',
    balance: 'Баланс всех счетов (сумма доходов - расходов)',
    analytics: 'Краткая аналитика: график доходов/расходов за месяц',
    recentTxs: 'Недавние транзакции (последние 5-10)',
    tips: 'Цели/уведомления/советы от ИИ-ассистента',
    quickActionsTip: 'Быстрые действия: +Доход, +Расход'
  }
};

interface DashboardContainerProps {
  locale: Locale;
}

export const DashboardContainer: FC<DashboardContainerProps> = ({ locale }) => {
  const t = dashboardTranslations[locale] || dashboardTranslations.en;
  
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <DashboardDataProvider locale={locale}>
      <motion.div
        className="p-4 md:p-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome section */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-2xl font-bold">
            {t.welcome}, <span className="text-primary-500">Ilyas</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.accessMessage}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - 8/12 on large screens */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div variants={itemVariants}>
              <OverviewSection locale={locale} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <AccountsSection locale={locale} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <AnalyticsSection locale={locale} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <TransactionsSection locale={locale} t={t} />
            </motion.div>
          </div>

          {/* Right column - 4/12 on large screens */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div variants={itemVariants}>
              <GoalsSection locale={locale} t={t} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <AqshaAISection locale={locale} />
            </motion.div>
            
            {/* Quick Actions Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <h3 className="font-medium text-lg">{t.quickActions}</h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Button 
                    variant="primary" 
                    leftIcon={<span className="text-xl">+</span>} 
                    fullWidth
                  >
                    {t.income}
                  </Button>
                  <Button 
                    variant="outline" 
                    leftIcon={<span className="text-xl">+</span>} 
                    fullWidth
                  >
                    {t.expense}
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
            
            {/* Dashboard Purpose Section (visible in the sample image) */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardBody>
                  <p className="font-medium">{t.purpose}</p>
                  <p className="font-medium mt-2">{t.blocks}:</p>
                  <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
                    <li>{t.balance}</li>
                    <li>{t.analytics}</li>
                    <li>{t.recentTxs}</li>
                    <li>{t.tips}</li>
                    <li>{t.quickActionsTip}</li>
                  </ul>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
        
        {/* Floating action buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
              aria-label="AqshaAI"
            >
              <span className="text-2xl">🤖</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
              aria-label="Add new transaction"
            >
              <span className="text-2xl">+</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </DashboardDataProvider>
  );
}; 