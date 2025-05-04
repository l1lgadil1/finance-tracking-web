'use client';

import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Filter } from 'lucide-react';
import { 
  Card, CardHeader, CardBody, 
  Button, DatePicker, FinancialSummaryCard
} from '@/shared/ui';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { ChartPeriod, TransactionType, CHART_COLORS } from '@/shared/constants/finance';

interface AnalyticsPageProps {
  params: {
    locale: Locale;
  };
}

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
      noData: 'No category data available'
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
      financialHealth: 'Financial Health'
    },
    dateRange: 'Date Range',
    from: 'From',
    to: 'To',
    loading: 'Loading analytics data...',
    noData: 'No data available for the selected period',
    error: 'Failed to load analytics data'
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
      noData: 'Нет данных по категориям'
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
      financialHealth: 'Финансовое здоровье'
    },
    dateRange: 'Период',
    from: 'С',
    to: 'По',
    loading: 'Загрузка данных аналитики...',
    noData: 'Нет данных за выбранный период',
    error: 'Ошибка загрузки данных аналитики'
  }
};

// Type for custom period
type ExtendedChartPeriod = ChartPeriod | 'custom';

// Sample mockup data for the demonstration
const mockCategories = [
  { name: 'Food', value: 1250, color: '#4CAF50' },
  { name: 'Housing', value: 2100, color: '#2196F3' },
  { name: 'Transportation', value: 850, color: '#FFC107' },
  { name: 'Entertainment', value: 450, color: '#9C27B0' },
  { name: 'Healthcare', value: 320, color: '#F44336' },
  { name: 'Others', value: 580, color: '#607D8B' }
];

const mockTrendData = [
  { month: 'Jan', income: 3500, expenses: 2800 },
  { month: 'Feb', income: 3200, expenses: 2600 },
  { month: 'Mar', income: 3800, expenses: 3100 },
  { month: 'Apr', income: 3600, expenses: 2900 },
  { month: 'May', income: 4200, expenses: 3400 },
  { month: 'Jun', income: 4500, expenses: 3200 }
];

const mockInsights = [
  {
    id: 1,
    title: 'Spending Alert',
    description: 'Your food expenses increased by 15% compared to last month',
    type: 'alert',
    icon: TrendingUp
  },
  {
    id: 2,
    title: 'Saving Opportunity',
    description: 'Reducing restaurant visits by 20% could save you $120 monthly',
    type: 'opportunity',
    icon: DollarSign
  },
  {
    id: 3,
    title: 'Positive Trend',
    description: 'Your savings rate has increased for 3 consecutive months',
    type: 'positive',
    icon: TrendingDown
  }
];

export const AnalyticsPage = ({ params }: AnalyticsPageProps) => {
  const { locale } = params;
  const t = translations[locale] || translations.en;
  const { theme } = useTheme();
  const { transactions } = useDashboardData();
  
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
      
      {/* Overview Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t.overview.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FinancialSummaryCard
            title={t.overview.totalIncome}
            value={summaryData.totalIncome}
            icon={<TrendingUp className="w-5 h-5" />}
            change={{ value: '+8%', positive: true }}
            className="bg-card"
          />
          <FinancialSummaryCard
            title={t.overview.totalExpenses}
            value={summaryData.totalExpenses}
            icon={<TrendingDown className="w-5 h-5" />}
            change={{ value: '+5%', positive: false }}
            className="bg-card"
          />
          <FinancialSummaryCard
            title={t.overview.netBalance}
            value={summaryData.netBalance}
            icon={<ArrowUpDown className="w-5 h-5" />}
            change={{ value: '+3%', positive: summaryData.netBalance > 0 }}
            className="bg-card"
          />
        </div>
      </section>
      
      {/* Income vs Expenses Section */}
      <section className="mb-8">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h2 className="text-xl font-semibold">{t.income} vs {t.expenses}</h2>
            <div className="flex items-center mt-2 sm:mt-0">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                {t.filters}
              </Button>
            </div>
          </CardHeader>
          
          <CardBody>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockTrendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fill: textColor }} />
                  <YAxis tick={{ fill: textColor }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                      color: textColor,
                      border: 'none',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: '10px',
                      color: textColor
                    }}
                  />
                  <Bar 
                    dataKey="expenses" 
                    name={t.expenses}
                    fill={CHART_COLORS.EXPENSE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="income" 
                    name={t.income}
                    fill={CHART_COLORS.INCOME}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </section>
      
      {/* Categories and Trends Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Categories Section */}
        <section>
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-xl font-semibold">{t.categories.title}</h2>
            </CardHeader>
            
            <CardBody>
              <div className="h-64 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${value}`, t.expenses]}
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                        color: textColor,
                        border: 'none',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Category legend */}
              <div className="grid grid-cols-2 gap-2">
                {mockCategories.map((category, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-sm mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-foreground">{category.name}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>
        
        {/* Trends Section */}
        <section>
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-xl font-semibold">{t.trends.title}</h2>
              <p className="text-sm text-muted-foreground">{t.trends.subtitle}</p>
            </CardHeader>
            
            <CardBody>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockTrendData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="month" tick={{ fill: textColor }} />
                    <YAxis tick={{ fill: textColor }} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                        color: textColor,
                        border: 'none',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      name={t.income}
                      stroke={CHART_COLORS.INCOME} 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      name={t.expenses}
                      stroke={CHART_COLORS.EXPENSE} 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
      
      {/* AI Insights Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t.insights.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockInsights.map((insight) => (
            <motion.div
              key={insight.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full">
                <CardBody>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center mr-3
                        ${insight.type === 'alert' ? 'bg-red-100 text-red-600' : 
                          insight.type === 'opportunity' ? 'bg-blue-100 text-blue-600' : 
                          'bg-green-100 text-green-600'}
                        dark:${insight.type === 'alert' ? 'bg-red-900 text-red-300' : 
                          insight.type === 'opportunity' ? 'bg-blue-900 text-blue-300' : 
                          'bg-green-900 text-green-300'}
                      `}>
                        <insight.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-medium">{insight.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}; 