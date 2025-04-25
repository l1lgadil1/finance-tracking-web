import { FC } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { useDashboardData } from '../providers/DashboardDataProvider';

const overviewTranslations = {
  en: {
    financialOverview: 'Financial Overview',
    totalBalance: 'Total Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    netSavings: 'Net Savings',
    expensesByCategory: 'Expenses by Category',
    loading: 'Loading...',
    error: 'Error loading data',
  },
  ru: {
    financialOverview: 'Финансовый обзор',
    totalBalance: 'Общий баланс',
    monthlyIncome: 'Месячный доход',
    monthlyExpenses: 'Месячные расходы',
    netSavings: 'Чистые сбережения',
    expensesByCategory: 'Расходы по категориям',
    loading: 'Загрузка...',
    error: 'Ошибка загрузки данных',
  }
};

interface OverviewSectionProps {
  locale: Locale;
}

export const OverviewSection: FC<OverviewSectionProps> = ({ locale }) => {
  const t = overviewTranslations[locale] || overviewTranslations.en;
  const { 
    totalBalance, 
    monthlyIncome, 
    monthlyExpenses, 
    netSavings,
    accounts,
    transactions 
  } = useDashboardData();
  
  // Loading state
  if (accounts.loading || transactions.loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.financialOverview}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (accounts.error || transactions.error) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.financialOverview}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {accounts.error || transactions.error || t.error}
          </div>
        </CardBody>
      </Card>
    );
  }
  
  // Mock data for chart - in a real app we'd calculate this from transactions
  const expenseCategories = [
    { name: 'Food', value: 650 },
    { name: 'Rent', value: 800 },
    { name: 'Transport', value: 200 },
    { name: 'Entertainment', value: 150 },
    { name: 'Other', value: 50.75 },
  ];
  
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t.financialOverview}</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Balance */}
          <motion.div 
            className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.totalBalance}</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">${totalBalance.toFixed(2)}</p>
          </motion.div>
          
          {/* Monthly Income */}
          <motion.div 
            className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.monthlyIncome}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">${monthlyIncome.toFixed(2)}</p>
          </motion.div>
          
          {/* Monthly Expenses */}
          <motion.div 
            className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.monthlyExpenses}</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">${monthlyExpenses.toFixed(2)}</p>
          </motion.div>
          
          {/* Net Savings */}
          <motion.div 
            className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.netSavings}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${netSavings.toFixed(2)}</p>
          </motion.div>
        </div>
        
        {/* Expense Categories Chart (placeholder) */}
        <div>
          <h3 className="text-lg font-medium mb-3">{t.expensesByCategory}</h3>
          <div className="h-60 w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            {/* Pie chart placeholder */}
            <div className="flex flex-wrap gap-2 p-4">
              {expenseCategories.map((category, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-3 h-3 rounded-full bg-primary-${(index + 3) * 100}`}></div>
                  <span className="text-sm">{category.name}: ${category.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 