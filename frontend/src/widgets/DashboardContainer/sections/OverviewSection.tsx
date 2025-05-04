import { FC, useMemo } from 'react';
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
    uncategorized: 'Uncategorized',
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
    uncategorized: 'Без категории',
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

  // Calculate expense categories from transactions
  const expenseCategories = useMemo(() => {
    if (!transactions.data) return [];

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get current month's expenses
    const currentMonthExpenses = transactions.data.filter(t => 
      t.type === 'expense' && new Date(t.date) >= firstDayOfMonth
    );

    // Group by category and sum amounts
    const categoryMap = currentMonthExpenses.reduce((acc, transaction) => {
      const categoryName = transaction.category?.name || t.uncategorized;
      const categoryColor = transaction.category?.color;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
          color: categoryColor || undefined
        };
      }
      acc[categoryName].value += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; color?: string }>);

    // Convert to array and sort by value
    return Object.values(categoryMap)
      .sort((a, b) => b.value - a.value);
  }, [transactions.data, t.uncategorized]);
  
  // Loading state
  if (accounts.loading || transactions.loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.financialOverview}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8" aria-live="polite" aria-busy="true">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin" role="progressbar" aria-label={t.loading}></div>
            <span className="sr-only">{t.loading}</span>
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
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md" role="alert" aria-live="assertive">
            {accounts.error || transactions.error || t.error}
          </div>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
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
            <p className="text-sm text-muted-foreground" id="total-balance-label">{t.totalBalance}</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400" aria-labelledby="total-balance-label">${totalBalance.toFixed(2)}</p>
          </motion.div>
          
          {/* Monthly Income */}
          <motion.div 
            className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="text-sm text-muted-foreground" id="monthly-income-label">{t.monthlyIncome}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400" aria-labelledby="monthly-income-label">${monthlyIncome.toFixed(2)}</p>
          </motion.div>
          
          {/* Monthly Expenses */}
          <motion.div 
            className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="text-sm text-muted-foreground" id="monthly-expenses-label">{t.monthlyExpenses}</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400" aria-labelledby="monthly-expenses-label">${monthlyExpenses.toFixed(2)}</p>
          </motion.div>
          
          {/* Net Savings */}
          <motion.div 
            className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="text-sm text-muted-foreground" id="net-savings-label">{t.netSavings}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" aria-labelledby="net-savings-label">${netSavings.toFixed(2)}</p>
          </motion.div>
        </div>
        
        {/* Expense Categories Chart */}
        <div>
          <h3 className="text-lg font-medium mb-3" id="expenses-by-category">{t.expensesByCategory}</h3>
          <div className="h-60 w-full bg-muted rounded-lg flex items-center justify-center" aria-labelledby="expenses-by-category">
            {/* Pie chart placeholder */}
            <div className="flex flex-wrap gap-2 p-4 max-h-52 overflow-y-auto w-full">
              {expenseCategories.length > 0 ? (
                expenseCategories.map((category, index) => (
                  <motion.div 
                    key={category.name} 
                    className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div 
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        category.color 
                          ? '' 
                          : `bg-primary-${((index % 5) + 3) * 100}`
                      }`}
                      style={category.color ? { backgroundColor: category.color } : undefined}
                      aria-hidden="true"
                    ></div>
                    <span className="text-sm whitespace-nowrap text-foreground">{category.name}: ${category.value.toFixed(2)}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground">No expense data available for this month</p>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 