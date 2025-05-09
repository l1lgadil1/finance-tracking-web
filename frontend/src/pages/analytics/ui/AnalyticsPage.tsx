'use client';

import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { DollarSign, ArrowUpDown } from 'lucide-react';
import { 
  Card, CardHeader, CardBody, 
  Button, DatePicker, FinancialSummaryCard
} from '@/shared/ui';
import { motion } from 'framer-motion';
import { useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { ChartPeriod, TransactionType, CHART_COLORS } from '@/shared/constants/finance';
import { FiCheckCircle } from 'react-icons/fi';
import { useParams } from 'next/navigation';


// Translation dictionary
const translations = {
  en: {
    pageTitle: 'Financial Analytics',
    timeRanges: {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
      custom: 'Custom'
    },
    filters: 'Filters',
    apply: 'Apply',
    reset: 'Reset',
    overview: {
      title: 'Financial Overview',
      totalIncome: 'Total Income',
      totalExpenses: 'Total Expenses',
      netBalance: 'Net Balance'
    },
    income: 'Income',
    expenses: 'Expenses',
    categories: {
      title: 'Expense by Category',
      noData: 'No category data available',
      uncategorized: 'Uncategorized'
    },
    trends: {
      title: 'Financial Trends',
      subtitle: 'Track your financial performance over time'
    },
    insights: {
      title: 'AI Insights',
      spendingPatterns: 'Spending Patterns',
      savingOpportunities: 'Saving Opportunities',
      budgetAlerts: 'Budget Alerts',
      financialHealth: 'Financial Health',
      noData: 'No AI insights available at this time.',
      financialTips: 'Financial Tips'
    },
    dateRange: 'Date Range',
    from: 'From',
    to: 'To',
    loading: 'Loading analytics data...',
    noData: 'No data available for the selected period',
    error: 'Failed to load analytics data',
    currency: '$',
    months: {
      jan: 'Jan',
      feb: 'Feb',
      mar: 'Mar',
      apr: 'Apr',
      may: 'May',
      jun: 'Jun',
      jul: 'Jul',
      aug: 'Aug',
      sep: 'Sep',
      oct: 'Oct',
      nov: 'Nov',
      dec: 'Dec'
    }
  },
  ru: {
    pageTitle: 'Финансовая аналитика',
    timeRanges: {
      daily: 'День',
      weekly: 'Неделя',
      monthly: 'Месяц',
      yearly: 'Год',
      custom: 'Свой'
    },
    filters: 'Фильтры',
    apply: 'Применить',
    reset: 'Сбросить',
    overview: {
      title: 'Финансовый обзор',
      totalIncome: 'Общий доход',
      totalExpenses: 'Общие расходы',
      netBalance: 'Чистый баланс'
    },
    income: 'Доходы',
    expenses: 'Расходы',
    categories: {
      title: 'Расходы по категориям',
      noData: 'Нет данных по категориям',
      uncategorized: 'Без категории'
    },
    trends: {
      title: 'Финансовые тренды',
      subtitle: 'Отслеживайте ваши финансовые показатели с течением времени'
    },
    insights: {
      title: 'AI аналитика',
      spendingPatterns: 'Схемы расходов',
      savingOpportunities: 'Возможности экономии',
      budgetAlerts: 'Предупреждения о бюджете',
      financialHealth: 'Финансовое здоровье',
      noData: 'В настоящий момент нет данных AI аналитики.',
      financialTips: 'Финансовые советы'
    },
    dateRange: 'Период',
    from: 'С',
    to: 'По',
    loading: 'Загрузка данных аналитики...',
    noData: 'Нет данных за выбранный период',
    error: 'Ошибка загрузки данных аналитики',
    currency: '₽',
    months: {
      jan: 'Янв',
      feb: 'Фев',
      mar: 'Мар',
      apr: 'Апр',
      may: 'Май',
      jun: 'Июн',
      jul: 'Июл',
      aug: 'Авг',
      sep: 'Сен',
      oct: 'Окт',
      nov: 'Ноя',
      dec: 'Дек'
    }
  }
};

// Type for custom period
type ExtendedChartPeriod = ChartPeriod | 'custom';

export const AnalyticsPage = () => {
  const { locale } = useParams();
  const t = translations[locale as keyof typeof translations] || translations.en;
  const { theme } = useTheme();
  const { transactions, aiRecommendations } = useDashboardData();
  
  // State for period selection
  const [period, setPeriod] = useState<ChartPeriod | ExtendedChartPeriod>(ChartPeriod.MONTHLY);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });
  
  // Colors and styling based on theme
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
  
  // Calculate summary data
  const summaryData = useMemo(() => {
    if (!transactions.data) return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    
    const result = transactions.data.reduce((acc, transaction) => {
      if (transaction.type === TransactionType.INCOME) {
        acc.totalIncome += transaction.amount;
      } else if (transaction.type === TransactionType.EXPENSE) {
        acc.totalExpenses += transaction.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpenses: 0, netBalance: 0 });
    
    result.netBalance = result.totalIncome - result.totalExpenses;
    return result;
  }, [transactions.data]);

  // Calculate percentage change for financial metrics
  const calculateChangeData = useMemo(() => {
    if (!transactions.data) return { income: '0%', expenses: '0%', balance: '0%' };
    
    // Get current and previous period date ranges
    const now = new Date();
    const currentPeriodStart = new Date();
    const previousPeriodStart = new Date();
    const previousPeriodEnd = new Date();
    
    switch(period) {
      case 'daily' as ExtendedChartPeriod:
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
        previousPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      case ChartPeriod.WEEKLY:
        // Start from this week's Sunday (or Monday depending on preference)
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek;
        currentPeriodStart.setDate(diff);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setDate(diff - 7);
        previousPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodEnd.setDate(diff - 1);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      case ChartPeriod.MONTHLY:
        currentPeriodStart.setDate(1);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        previousPeriodStart.setDate(1);
        previousPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodEnd.setDate(0);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      case ChartPeriod.YEARLY:
        currentPeriodStart.setMonth(0, 1);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
        previousPeriodStart.setMonth(0, 1);
        previousPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodEnd.setFullYear(previousPeriodEnd.getFullYear() - 1);
        previousPeriodEnd.setMonth(11, 31);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      default:
        // Default to monthly if custom or unknown
        currentPeriodStart.setDate(1);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        previousPeriodStart.setDate(1);
        previousPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodEnd.setDate(0);
        previousPeriodEnd.setHours(23, 59, 59, 999);
    }
    
    // Current period transactions
    const currentTransactions = transactions.data.filter(t => {
      const date = new Date(t.date);
      return date >= currentPeriodStart && date <= now;
    });
    
    // Previous period transactions
    const previousTransactions = transactions.data.filter(t => {
      const date = new Date(t.date);
      return date >= previousPeriodStart && date <= previousPeriodEnd;
    });
    
    // Calculate totals for both periods
    const currentPeriod = currentTransactions.reduce((acc, t) => {
      if (t.type === TransactionType.INCOME) acc.income += t.amount;
      else if (t.type === TransactionType.EXPENSE) acc.expenses += t.amount;
      return acc;
    }, { income: 0, expenses: 0, balance: 0 });
    currentPeriod.balance = currentPeriod.income - currentPeriod.expenses;
    
    const previousPeriod = previousTransactions.reduce((acc, t) => {
      if (t.type === TransactionType.INCOME) acc.income += t.amount;
      else if (t.type === TransactionType.EXPENSE) acc.expenses += t.amount;
      return acc;
    }, { income: 0, expenses: 0, balance: 0 });
    previousPeriod.balance = previousPeriod.income - previousPeriod.expenses;
    
    // Calculate percentage changes
    const calculatePercentage = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / Math.abs(previous)) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    };
    
    return {
      income: calculatePercentage(currentPeriod.income, previousPeriod.income),
      expenses: calculatePercentage(currentPeriod.expenses, previousPeriod.expenses),
      balance: calculatePercentage(currentPeriod.balance, previousPeriod.balance)
    };
  }, [transactions.data, period]);

  // Calculate category data for pie chart
  const categoryData = useMemo(() => {
    if (!transactions.data) return [];
    
    // Filter for expense transactions only
    const expenseTransactions = transactions.data.filter(
      transaction => transaction.type === TransactionType.EXPENSE
    );
    
    // Group by category and sum amounts
    const categoryMap = expenseTransactions.reduce((acc, transaction) => {
      const categoryId = transaction.categoryId;
      const categoryName = transaction.category?.name || t.categories.uncategorized;
      
      if (!acc[categoryId]) {
        // Safely assign a color from CHART_COLORS or use a default color
        const colorIndex = Object.keys(acc).length % 6; // Limit to a reasonable number
        const defaultColors = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336', '#607D8B'];
        const color = transaction.category?.color || defaultColors[colorIndex];
        
        acc[categoryId] = {
          id: categoryId,
          name: categoryName,
          value: 0,
          color: color
        };
      }
      
      acc[categoryId].value += transaction.amount;
      return acc;
    }, {} as Record<string, {id: string, name: string, value: number, color: string}>);
    
    return Object.values(categoryMap);
  }, [transactions.data, t.categories.uncategorized]);

  // Calculate trend data for line chart
  const trendData = useMemo(() => {
    if (!transactions.data) return [];
    
    // Get transactions in the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Create a map of month names
    const monthNames = [
      t.months.jan, t.months.feb, t.months.mar, t.months.apr, t.months.may, t.months.jun, 
      t.months.jul, t.months.aug, t.months.sep, t.months.oct, t.months.nov, t.months.dec
    ];
    
    // Initialize data array with last 6 months
    const monthlyData: Record<string, {month: string, income: number, expenses: number}> = {};
    
    // Fill with zeros for the last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = monthNames[date.getMonth()];
      
      monthlyData[monthKey] = {
        month: monthName,
        income: 0,
        expenses: 0
      };
    }
    
    // Sum transactions by month
    transactions.data.forEach(transaction => {
      const date = new Date(transaction.date);
      // Only include transactions from the last 6 months
      if (date >= sixMonthsAgo) {
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (monthlyData[monthKey]) {
          if (transaction.type === TransactionType.INCOME) {
            monthlyData[monthKey].income += transaction.amount;
          } else if (transaction.type === TransactionType.EXPENSE) {
            monthlyData[monthKey].expenses += transaction.amount;
          }
        }
      }
    });
    
    // Convert to array and sort by date
    return Object.values(monthlyData).reverse();
  }, [transactions.data, t.months]);

  // Toggle custom date range selection
  const handlePeriodChange = (newPeriod: ChartPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod === 'custom' as ExtendedChartPeriod) {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
    }
  };

  // If data is loading
  if (transactions.loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">{t.pageTitle}</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-16 h-16 border-t-4 border-primary-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-4 sm:mb-0">{t.pageTitle}</h1>
        
        {/* Time Range Selection */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(ChartPeriod).map(([key, value]) => (
            <Button
              key={key}
              variant={period === value ? "primary" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange(value)}
            >
              {t.timeRanges[value.toLowerCase() as keyof typeof t.timeRanges]}
            </Button>
          ))}
          <Button
            variant={showCustomDateRange ? "primary" : "outline"}
            size="sm"
            onClick={() => {
              setShowCustomDateRange(!showCustomDateRange);
              if (!showCustomDateRange) setPeriod('custom' as ExtendedChartPeriod);
            }}
          >
            {t.timeRanges.custom}
          </Button>
        </div>
      </div>
      
      {/* Custom Date Range Picker */}
      {showCustomDateRange && (
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <DatePicker
                  label={t.from}
                  value={dateRange.from}
                  onChange={(date) => setDateRange({ ...dateRange, from: date || new Date() })}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <DatePicker
                  label={t.to}
                  value={dateRange.to}
                  onChange={(date) => setDateRange({ ...dateRange, to: date || new Date() })}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="md">
                  {t.apply}
                </Button>
                <Button variant="outline" size="md">
                  {t.reset}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
      
      {/* Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <FinancialSummaryCard
          title={t.overview.totalIncome}
          value={summaryData.totalIncome}
          change={{ value: calculateChangeData.income, positive: !calculateChangeData.income.startsWith('-') }}
          icon={<DollarSign className="w-5 h-5" />}
          className="bg-card"
        />
        <FinancialSummaryCard
          title={t.overview.totalExpenses}
          value={summaryData.totalExpenses}
          change={{ value: calculateChangeData.expenses, positive: calculateChangeData.expenses.startsWith('-') }}
          icon={<ArrowUpDown className="w-5 h-5" />}
          className="bg-card"
        />
        <FinancialSummaryCard
          title={t.overview.netBalance}
          value={summaryData.netBalance}
          change={{ value: calculateChangeData.balance, positive: !calculateChangeData.balance.startsWith('-') }}
          icon={<DollarSign className="w-5 h-5" />}
          className="bg-card"
        />
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Income vs Expenses */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{t.income} vs {t.expenses}</h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fill: textColor }} />
                  <YAxis tick={{ fill: textColor }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" name={t.income} fill={CHART_COLORS.INCOME} />
                  <Bar dataKey="expenses" name={t.expenses} fill={CHART_COLORS.EXPENSE} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        
        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{t.categories.title}</h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              {categoryData.length > 0 ? (
                <div className="flex h-full">
                  <ResponsiveContainer width="60%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${t.currency}${value}`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="w-[40%] flex flex-col justify-center">
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                      {categoryData.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm truncate mr-1">{category.name}</span>
                          <span className="text-sm text-muted-foreground ml-auto">
                            {t.currency}{category.value.toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {t.categories.noData}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Financial Trends */}
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-xl font-semibold">{t.trends.title}</h2>
              <p className="text-sm text-muted-foreground">{t.trends.subtitle}</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fill: textColor }} />
                  <YAxis tick={{ fill: textColor }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    name={t.income}
                    stroke={CHART_COLORS.INCOME} 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name={t.expenses}
                    stroke={CHART_COLORS.EXPENSE}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* AI Insights */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.insights.title}</h2>
        </CardHeader>
        <CardBody>
          {aiRecommendations.loading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-t-4 border-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : aiRecommendations.data && aiRecommendations.data.insights && aiRecommendations.data.insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiRecommendations.data.insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start mb-2">
                    <div className={`p-2 rounded-full bg-primary/10 text-primary mr-3`}>
                      <span className="text-xl">{insight.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{insight.type}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t.insights.noData}
            </div>
          )}
          
          {aiRecommendations.data && aiRecommendations.data.tips && aiRecommendations.data.tips.length > 0 && (
            <div className="mt-6 bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-3">{t.insights.financialTips}</h3>
              <ul className="space-y-2">
                {aiRecommendations.data.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}; 