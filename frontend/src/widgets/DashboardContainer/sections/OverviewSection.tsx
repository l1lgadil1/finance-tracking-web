import { FC } from 'react';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';

const overviewTranslations = {
  en: {
    financialOverview: 'Financial Overview',
    totalBalance: 'Total Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    netSavings: 'Net Savings',
    expensesByCategory: 'Expenses by Category',
  },
  ru: {
    financialOverview: 'Финансовый обзор',
    totalBalance: 'Общий баланс',
    monthlyIncome: 'Месячный доход',
    monthlyExpenses: 'Месячные расходы',
    netSavings: 'Чистые сбережения',
    expensesByCategory: 'Расходы по категориям',
  }
};

interface OverviewSectionProps {
  locale: Locale;
}

export const OverviewSection: FC<OverviewSectionProps> = ({ locale }) => {
  const t = overviewTranslations[locale] || overviewTranslations.en;
  
  // Mock data for metrics
  const metrics = {
    totalBalance: 2698.12,
    monthlyIncome: 3500.00,
    monthlyExpenses: 1850.75,
    netSavings: 1649.25,
  };
  
  // Mock data for chart
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
          <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.totalBalance}</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">${metrics.totalBalance.toFixed(2)}</p>
          </div>
          
          {/* Monthly Income */}
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.monthlyIncome}</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">${metrics.monthlyIncome.toFixed(2)}</p>
          </div>
          
          {/* Monthly Expenses */}
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.monthlyExpenses}</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">${metrics.monthlyExpenses.toFixed(2)}</p>
          </div>
          
          {/* Net Savings */}
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.netSavings}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${metrics.netSavings.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Expense Categories Chart (placeholder) */}
        <div>
          <h3 className="text-lg font-medium mb-3">{t.expensesByCategory}</h3>
          <div className="h-60 w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            {/* Pie chart placeholder */}
            <div className="flex flex-wrap gap-2 p-4">
              {expenseCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2"
                >
                  <div className={`w-3 h-3 rounded-full bg-primary-${(index + 3) * 100}`}></div>
                  <span className="text-sm">{category.name}: ${category.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 