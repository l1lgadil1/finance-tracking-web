import { useState } from 'react';
import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardBody } from '@/shared/ui';

// Sample data for the chart (in real app, would come from API)
const data = [
  { name: 'Jan', expense: 400, income: 600 },
  { name: 'Feb', expense: 300, income: 550 },
  { name: 'Mar', expense: 500, income: 700 },
  { name: 'Apr', expense: 200, income: 600 },
  { name: 'May', expense: 350, income: 650 },
  { name: 'Jun', expense: 450, income: 700 },
];

type ChartPeriod = 'monthly' | 'weekly' | 'yearly';

export const TransactionChart = () => {
  const { theme } = useTheme();
  const [period, setPeriod] = useState<ChartPeriod>('monthly');

  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Income vs Expenses</h2>
        <div className="flex rounded-md overflow-hidden border border-border">
          <button 
            onClick={() => setPeriod('weekly')} 
            className={`px-3 py-1 text-sm ${period === 'weekly' 
              ? 'bg-primary-500 text-white' 
              : 'bg-card hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setPeriod('monthly')} 
            className={`px-3 py-1 text-sm ${period === 'monthly' 
              ? 'bg-primary-500 text-white' 
              : 'bg-card hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setPeriod('yearly')} 
            className={`px-3 py-1 text-sm ${period === 'yearly' 
              ? 'bg-primary-500 text-white' 
              : 'bg-card hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            Yearly
          </button>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill="#0073ff" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}; 