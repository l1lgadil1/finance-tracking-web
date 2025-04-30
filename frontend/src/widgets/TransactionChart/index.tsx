import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardBody } from '@/shared/ui';
import { useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { ChartPeriod, TransactionType, CHART_COLORS, TIME_PERIODS, DATE_FORMATS } from '@/shared/constants/finance';

interface ChartData {
  name: string;
  expense: number;
  income: number;
}

interface PeriodConfig {
  unit: string;
  count: number;
  format: (date: Date) => string;
}

const PERIOD_CONFIG: Record<ChartPeriod, PeriodConfig> = {
  [ChartPeriod.WEEKLY]: {
    unit: 'day',
    count: TIME_PERIODS.DAYS_7,
    format: (date: Date) => date.toLocaleDateString(undefined, DATE_FORMATS.WEEKDAY_SHORT)
  },
  [ChartPeriod.MONTHLY]: {
    unit: 'month',
    count: TIME_PERIODS.MONTHS_6,
    format: (date: Date) => date.toLocaleDateString(undefined, DATE_FORMATS.MONTH_SHORT)
  },
  [ChartPeriod.YEARLY]: {
    unit: 'month',
    count: TIME_PERIODS.MONTHS_12,
    format: (date: Date) => date.toLocaleDateString(undefined, DATE_FORMATS.MONTH_SHORT)
  }
};

export const TransactionChart = () => {
  const { theme } = useTheme();
  const [period, setPeriod] = useState<ChartPeriod>(ChartPeriod.MONTHLY);
  const { transactions } = useDashboardData();

  const chartData = useMemo(() => {
    if (!transactions.data) return [];

    const now = new Date();
    const { count, format } = PERIOD_CONFIG[period];
    
    // Create date buckets
    const buckets: Record<string, ChartData> = {};
    
    // Initialize buckets
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now);
      if (period === ChartPeriod.WEEKLY) {
        date.setDate(date.getDate() - i);
      } else {
        date.setMonth(date.getMonth() - i);
      }
      const key = format(date);
      buckets[key] = { name: key, expense: 0, income: 0 };
    }

    // Fill buckets with transaction data
    transactions.data.forEach(transaction => {
      const date = new Date(transaction.date);
      const key = format(date);
      
      if (buckets[key]) {
        if (transaction.type === TransactionType.EXPENSE) {
          buckets[key].expense += transaction.amount;
        } else if (transaction.type === TransactionType.INCOME) {
          buckets[key].income += transaction.amount;
        }
      }
    });

    return Object.values(buckets);
  }, [transactions.data, period]);

  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';

  if (transactions.loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Income vs Expenses</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center h-80">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Income vs Expenses</h2>
        <div className="flex rounded-md overflow-hidden border border-border">
          {Object.values(ChartPeriod).map((chartPeriod) => (
            <button 
              key={chartPeriod}
              onClick={() => setPeriod(chartPeriod)} 
              className={`px-3 py-1 text-sm ${period === chartPeriod 
                ? 'bg-primary-500 text-white' 
                : 'bg-card hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {chartPeriod.charAt(0).toUpperCase() + chartPeriod.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor }} />
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
                dataKey="expense" 
                name="Expenses" 
                fill={CHART_COLORS.EXPENSE}
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill={CHART_COLORS.INCOME}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}; 