import { FC } from 'react';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface TransactionsSectionProps {
  locale: Locale; // Kept for consistency with other sections
  t: {
    recentTransactions: string;
    viewAll: string;
    transaction: string;
    amount: string;
    status: string;
    date: string;
    category: string;
  };
}

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  status: 'processing' | 'success' | 'declined';
  date: string;
  category: string;
  icon?: string;
}

export const TransactionsSection: FC<TransactionsSectionProps> = ({ t }) => {
  // Mock data for transactions
  const transactions: Transaction[] = [
    {
      id: 1,
      name: 'Spotify',
      amount: -15.00,
      type: 'expense',
      status: 'processing',
      date: 'Wed 1:00pm',
      category: 'Subscriptions',
      icon: '🎵',
    },
    {
      id: 2,
      name: 'Alexa Doe',
      amount: 88.00,
      type: 'income',
      status: 'success',
      date: 'Wed 2:45am',
      category: 'Deposit',
      icon: '👤',
    },
    {
      id: 3,
      name: 'Figma',
      amount: -18.99,
      type: 'expense',
      status: 'processing',
      date: 'Tue 6:10pm',
      category: 'Income',
      icon: '🎨',
    },
    {
      id: 4,
      name: 'Fresh F&V',
      amount: -88.00,
      type: 'expense',
      status: 'success',
      date: 'Tue 12:15pm',
      category: 'Groceries',
      icon: '🥦',
    },
    {
      id: 5,
      name: 'Sam Sulek',
      amount: -40.20,
      type: 'expense',
      status: 'declined',
      date: 'Tue 5:40am',
      category: 'Food',
      icon: '🍔',
    },
  ];
  
  // Bank tabs
  const bankTabs = [
    { id: 'chase', name: 'Chase Bank', active: true },
    { id: 'boa', name: 'Bank of America', active: false },
    { id: 'platypus', name: 'First Platypus Bank', active: false },
  ];
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t.recentTransactions}</h2>
        <Button variant="ghost" size="sm">
          {t.viewAll}
        </Button>
      </CardHeader>
      
      {/* Bank tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {bankTabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                tab.active 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Active bank account info */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
          CB
        </div>
        <div>
          <p className="font-medium">Chase Bank</p>
          <p className="text-primary-600 dark:text-primary-400 font-semibold">$2,588.12</p>
        </div>
        <span className="ml-auto text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-1 rounded">
          savings
        </span>
      </div>
      
      {/* Transactions table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">{t.transaction}</th>
              <th className="px-4 py-3 text-right">{t.amount}</th>
              <th className="px-4 py-3 text-center">{t.status}</th>
              <th className="px-4 py-3 text-left">{t.date}</th>
              <th className="px-4 py-3 text-right">{t.category}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <span>{transaction.icon}</span>
                    </div>
                    <span className="font-medium">{transaction.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <Badge 
                    variant={
                      transaction.status === 'success' ? 'success' : 
                      transaction.status === 'processing' ? 'primary' : 
                      'error'
                    }
                    size="sm"
                    rounded
                  >
                    <span className="inline-block w-2 h-2 rounded-full mr-1 bg-current"></span>
                    {transaction.status}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {transaction.date}
                </td>
                <td className="px-4 py-4 text-right">
                  <Badge 
                    variant={
                      transaction.category === 'Subscriptions' ? 'primary' : 
                      transaction.category === 'Deposit' ? 'secondary' : 
                      transaction.category === 'Income' ? 'success' : 
                      transaction.category === 'Groceries' ? 'info' : 
                      'error'
                    }
                    size="sm"
                  >
                    {transaction.category}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}; 