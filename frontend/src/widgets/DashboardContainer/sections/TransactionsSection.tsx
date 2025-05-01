import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useDashboardData } from '../providers/DashboardDataProvider';
import { Account } from '@/entities/account/api/accountApi';
import { Transaction } from '@/entities/transaction/api/transactionApi';

interface TransactionsSectionProps {
  locale: Locale; 
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

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (isToday) {
    return `Today ${time}`;
  } else if (isYesterday) {
    return `Yesterday ${time}`;
  } else {
    return `${date.toLocaleDateString()} ${time}`;
  }
};

// Helper to get transaction icon
const getTransactionIcon = (type: string): string => {
  switch (type) {
    case 'income': return '💰';
    case 'expense': return '💸';
    case 'transfer': return '↔️';
    case 'debt': return '📝';
    case 'debt_repay': return '✅';
    default: return '🧾';
  }
};

// Helper to get transaction status
const getTransactionStatus = (): 'success' | 'processing' | 'error' => {
  // In a real app, this would be based on actual transaction status from backend
  // For now, just return 'success' for all transactions
  return 'success';
};

export const TransactionsSection: FC<TransactionsSectionProps> = ({ locale, t }) => {
  const { transactions, accounts } = useDashboardData();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Filter transactions by selected account
  const filteredTransactions = selectedAccountId
    ? transactions.data.filter(tx => tx.accountId === selectedAccountId)
    : transactions.data;
    
  // Get 5 most recent transactions
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Loading state
  if (transactions.loading || accounts.loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.recentTransactions}</h2>
        </CardHeader>
        <div className="flex justify-center items-center p-8">
          <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  // Error state
  if (transactions.error || accounts.error) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.recentTransactions}</h2>
        </CardHeader>
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md m-4">
          {transactions.error || accounts.error}
        </div>
      </Card>
    );
  }

  // Helper to find account by id
  const findAccount = (accountId: string): Account | undefined => {
    return accounts.data.find(account => account.id === accountId);
  };
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t.recentTransactions}</h2>
        <Button variant="ghost" size="sm">
          {t.viewAll}
        </Button>
      </CardHeader>
      
      {/* Bank tabs */}
      {accounts.data.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                !selectedAccountId
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setSelectedAccountId(null)}
            >
              All Accounts
            </button>
            
            {accounts.data.map((account) => (
              <button
                key={account.id}
                className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer ${
                  selectedAccountId === account.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setSelectedAccountId(account.id)}
              >
                {account.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Active bank account info */}
      {selectedAccountId && (
        <div className="p-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
          {(() => {
            const selectedAccount = findAccount(selectedAccountId);
            if (!selectedAccount) return null;
            
            return (
              <>
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                  {selectedAccount.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{selectedAccount.name}</p>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold">${selectedAccount.balance.toFixed(2)}</p>
                </div>
              </>
            );
          })()}
        </div>
      )}
      
      {/* Empty state */}
      {recentTransactions.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
        </div>
      )}
      
      {/* Transactions table */}
      {recentTransactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">{t.transaction}</th>
                <th className="px-4 py-3 text-right">{t.amount}</th>
                <th className="px-4 py-3 text-center">{t.status}</th>
                <th className="px-4 py-3 text-left">{t.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((transaction) => {
                const status = getTransactionStatus();
                const accountName = findAccount(transaction.accountId)?.name || 'Unknown Account';
                
                return (
                  <motion.tr 
                    key={transaction.id} 
                    className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                    whileHover={{ 
                      backgroundColor: "rgba(59, 130, 246, 0.05)", 
                      transition: { duration: 0.2 } 
                    }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <span>{getTransactionIcon(transaction.type)}</span>
                        </div>
                        <div>
                          <span className="font-medium">{transaction.description || 'Transaction'}</span>
                          <p className="text-xs text-gray-500">{accountName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge 
                        variant={
                          status === 'success' ? 'success' : 
                          status === 'processing' ? 'primary' : 
                          'error'
                        }
                        size="sm"
                        rounded
                      >
                        <span className="inline-block w-2 h-2 rounded-full mr-1 bg-current"></span>
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.date)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}; 