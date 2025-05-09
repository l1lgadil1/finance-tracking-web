import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { Badge } from '@/shared/ui/Badge';

const analyticsTranslations = {
  en: {
    analytics: 'Analytics',
    monthlyOverview: 'Monthly Overview',
    income: 'Income',
    expenses: 'Expenses',
    loading: 'Loading...',
    error: 'Error loading data',
    incomeVsExpenses: 'Income vs Expenses',
    last30Days: 'Last 30 days',
    today: 'Today',
    week: 'Week',
    month: 'Month',
    quarter: 'Quarter',
    year: 'Year',
    highest: 'Highest',
    lowest: 'Lowest',
    average: 'Average'
  },
  ru: {
    analytics: 'Аналитика',
    monthlyOverview: 'Месячный обзор',
    income: 'Доходы',
    expenses: 'Расходы',
    loading: 'Загрузка...',
    error: 'Ошибка загрузки данных',
    incomeVsExpenses: 'Доходы и Расходы',
    last30Days: 'Последние 30 дней',
    today: 'Сегодня',
    week: 'Неделя',
    month: 'Месяц',
    quarter: 'Квартал',
    year: 'Год',
    highest: 'Максимум',
    lowest: 'Минимум',
    average: 'Среднее'
  }
};

interface AnalyticsSectionProps {
  locale: Locale;
}

export const AnalyticsSection: FC<AnalyticsSectionProps> = ({ locale }) => {
  const t = analyticsTranslations[locale] || analyticsTranslations.en;
  const { transactions, isLoading, hasErrors } = useDashboardData();

  // Generate sample data for bar chart
  const chartData = useMemo(() => {
    if (!transactions.data) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Sample data for monthly chart (last 15 days and next 15 days)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Create chart data
    return days.map(day => {
      const date = new Date(currentYear, currentMonth, day);
      const dayTransactions = transactions.data.filter(t => {
        const txDate = new Date(t.date);
        return txDate.getDate() === day && 
               txDate.getMonth() === currentMonth && 
               txDate.getFullYear() === currentYear;
      });
      
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
      return {
        day: day,
        date: date,
        income,
        expenses
      };
    });
  }, [transactions.data]);

  // Calculate highest, lowest, average values
  const stats = useMemo(() => {
    if (chartData.length === 0) return { highest: 0, lowest: 0, average: 0 };
    
    const incomeValues = chartData.map(item => item.income);
    const expenseValues = chartData.map(item => item.expenses);
    
    // Get only positive values for better stats calculation
    const positiveIncomeValues = incomeValues.filter(v => v > 0);
    const positiveExpenseValues = expenseValues.filter(v => v > 0);
    
    // If there are no positive values, default to 0
    const highest = Math.max(...incomeValues, ...expenseValues, 0);
    
    // Handle case when there are no positive values to find minimum
    let lowest = 0;
    if (positiveIncomeValues.length > 0 || positiveExpenseValues.length > 0) {
      const allPositiveValues = [...positiveIncomeValues, ...positiveExpenseValues];
      lowest = allPositiveValues.length > 0 ? Math.min(...allPositiveValues) : 0;
    }
    
    const incomeSum = incomeValues.reduce((sum, val) => sum + val, 0);
    const expenseSum = expenseValues.reduce((sum, val) => sum + val, 0);
    
    // Calculate average only if there's actual data
    const totalEntries = incomeValues.length + expenseValues.length;
    const average = totalEntries > 0 ? (incomeSum + expenseSum) / totalEntries : 0;
    
    return { highest, lowest, average };
  }, [chartData]);
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.analytics}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
            <span className="sr-only">{t.loading}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (hasErrors) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.analytics}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {t.error}
          </div>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-semibold">{t.incomeVsExpenses}</h2>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Badge variant="secondary" className="cursor-pointer font-medium">{t.today}</Badge>
          <Badge variant="secondary" className="cursor-pointer font-medium">{t.week}</Badge>
          <Badge variant="primary" className="cursor-pointer font-medium">{t.month}</Badge>
          <Badge variant="secondary" className="cursor-pointer font-medium">{t.quarter}</Badge>
          <Badge variant="secondary" className="cursor-pointer font-medium">{t.year}</Badge>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-64 w-full bg-card rounded-lg border border-border p-4 relative">
            <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
              {chartData.slice(0, 14).map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Income bar */}
                  <motion.div 
                    className="w-4 bg-green-500/80 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(data.income / 50, 150)}px` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  ></motion.div>
                  
                  {/* Expense bar */}
                  <motion.div 
                    className="w-4 bg-red-500/80 rounded-t mt-1"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(data.expenses / 50, 150)}px` }}
                    transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                  ></motion.div>
                  
                  {/* X-axis label */}
                  <span className="text-xs text-muted-foreground mt-1">{data.day}</span>
                </div>
              ))}
            </div>
            
            {/* Chart legend */}
            <div className="absolute top-2 right-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
                <span className="text-sm">{t.income}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
                <span className="text-sm">{t.expenses}</span>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div 
              className="bg-card-hover rounded-lg p-3 text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <p className="text-sm text-muted-foreground">{t.highest}</p>
              <p className="text-xl font-semibold">${stats.highest.toFixed(2)}</p>
            </motion.div>
            
            <motion.div 
              className="bg-card-hover rounded-lg p-3 text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <p className="text-sm text-muted-foreground">{t.average}</p>
              <p className="text-xl font-semibold">${stats.average.toFixed(2)}</p>
            </motion.div>
            
            <motion.div 
              className="bg-card-hover rounded-lg p-3 text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <p className="text-sm text-muted-foreground">{t.lowest}</p>
              <p className="text-xl font-semibold">${stats.lowest.toFixed(2)}</p>
            </motion.div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 