import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart (in real app, would come from API)
const data = [
  { name: 'Jan', expense: 400, income: 600 },
  { name: 'Feb', expense: 300, income: 550 },
  { name: 'Mar', expense: 500, income: 700 },
  { name: 'Apr', expense: 200, income: 600 },
  { name: 'May', expense: 350, income: 650 },
  { name: 'Jun', expense: 450, income: 700 },
];

export const TransactionChart = () => {
  const { theme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-5xl rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                border: 'none',
                borderRadius: '0.5rem'
              }} 
            />
            <Bar dataKey="expense" fill="#f87171" />
            <Bar dataKey="income" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}; 