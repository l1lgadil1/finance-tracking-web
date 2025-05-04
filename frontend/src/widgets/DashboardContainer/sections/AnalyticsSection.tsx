import { FC, useMemo } from 'react';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { useDashboardData } from '../providers/DashboardDataProvider';
import { CHART_COLORS } from '@/shared/constants/finance';

const analyticsTranslations = {
  en: {
    monthlyAnalytics: 'Monthly Analytics',
    income: 'Income',
    expenses: 'Expenses',
    spentLess: 'Analyzing your spending patterns...',
    loading: 'Loading analytics...',
    error: 'Failed to load analytics',
    noData: 'No transaction data available'
  },
  ru: {
    monthlyAnalytics: 'Месячная аналитика',
    income: 'Доходы',
    expenses: 'Расходы',
    spentLess: 'Анализ ваших расходов...',
    loading: 'Загрузка аналитики...',
    error: 'Не удалось загрузить аналитику',
    noData: 'Нет данных о транзакциях'
  }
};

interface AnalyticsSectionProps {
  locale: Locale;
}

interface DailyData {
  date: string;
  income: number;
  expense: number;
}

export const AnalyticsSection: FC<AnalyticsSectionProps> = ({ locale }) => {
  const t = analyticsTranslations[locale] || analyticsTranslations.en;
  const { theme } = useTheme();
  const { transactions } = useDashboardData();
  
  const chartData = useMemo(() => {
    if (!transactions.data) return [];

    // Get the last 15 days
    const today = new Date();
    const dates = Array.from({ length: 15 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (14 - i));
      return date.toISOString().split('T')[0];
    });

    // Initialize data for each day
    const dailyData: Record<string, DailyData> = {};
    dates.forEach(date => {
      dailyData[date] = {
        date,
        income: 0,
        expense: 0
      };
    });

    // Aggregate transactions by date
    transactions.data.forEach(transaction => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      if (dailyData[date]) {
        if (transaction.type === 'income') {
          dailyData[date].income += transaction.amount;
        } else if (transaction.type === 'expense') {
          dailyData[date].expense += transaction.amount;
        }
      }
    });

    return Object.values(dailyData);
  }, [transactions.data]);

  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';

  if (transactions.loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.monthlyAnalytics}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center h-60">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (transactions.error) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.monthlyAnalytics}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center h-60 text-red-500">
            {t.error}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{t.monthlyAnalytics}</h2>
        </div>
      </CardHeader>
      <CardBody>
        {/* AI Insight Box */}
        <div className="mb-4 bg-background p-3 rounded-lg flex items-center">
          <div className="mr-3 w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
            AI
          </div>
          <p className="text-sm text-foreground">{t.spentLess}</p>
        </div>
      
        {/* Real chart with actual data */}
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: textColor }}
                tickFormatter={(value) => new Date(value).getDate().toString()}
              />
              <YAxis tick={{ fill: textColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                  color: textColor,
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Bar 
                dataKey="expense" 
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
        
        {/* Legend */}
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3" style={{ backgroundColor: CHART_COLORS.INCOME }}></div>
            <span className="text-sm ml-2 text-foreground">{t.income}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3" style={{ backgroundColor: CHART_COLORS.EXPENSE }}></div>
            <span className="text-sm ml-2 text-foreground">{t.expenses}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 