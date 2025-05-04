import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardHeader, CardBody } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useDashboardData } from '../providers/DashboardDataProvider';
import { Account } from '@/entities/account/api/accountApi';
import Link from 'next/link';

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
    case 'debt_give': return '📝';
    case 'debt_take': return '📝';
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
    ? transactions.data?.filter(tx => tx.accountId === selectedAccountId) || []
    : transactions.data || [];
    
  // Get 5 most recent transactions
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Loading state
  if (transactions.loading || accounts.loading) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.recentTransactions}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8" aria-live="polite" aria-busy="true">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin" role="progressbar"></div>
            <span className="sr-only">Loading transactions...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (transactions.error || accounts.error) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.recentTransactions}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md" role="alert" aria-live="assertive">
            {transactions.error || accounts.error}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Helper to find account by id
  const findAccount = (accountId: string): Account | undefined => {
    return accounts.data?.find(account => account.id === accountId);
  };
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t.recentTransactions}</h2>
        <Link href={`/${locale}/dashboard/transactions`} passHref>
          <Button variant="ghost" size="sm" className="hover:bg-accent">
            {t.viewAll}
          </Button>
        </Link>
      </CardHeader>
      
      {/* Bank tabs */}
      {accounts.data && accounts.data.length > 0 && (
        <div className="border-b border-border">
          <div className="flex overflow-x-auto px-4 hide-scrollbar">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer whitespace-nowrap transition-colors duration-150 ${
                !selectedAccountId
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSelectedAccountId(null)}
              aria-pressed={!selectedAccountId}
            >
              All Accounts
            </button>
            
            {accounts.data.map((account) => (
              <button
                key={account.id}
                className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer whitespace-nowrap transition-colors duration-150 ${
                  selectedAccountId === account.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSelectedAccountId(account.id)}
                aria-pressed={selectedAccountId === account.id}
              >
                {account.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Active bank account info */}
      {selectedAccountId && (
        <div className="p-4 flex items-center gap-3 border-b border-border">
          {(() => {
            const selectedAccount = findAccount(selectedAccountId);
            if (!selectedAccount) return null;
            
            return (
              <>
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold" aria-hidden="true">
                  {selectedAccount.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedAccount.name}</p>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold">${selectedAccount.balance.toFixed(2)}</p>
                </div>
              </>
            );
          })()}
        </div>
      )}
      
      <CardBody className="p-0">
        {/* Empty state */}
        {recentTransactions.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
        
        {/* Transactions table */}
        {recentTransactions.length > 0 && (
          <div className="overflow-x-auto" role="region" aria-label="Recent transactions">
            <table className="w-full">
              <thead className="bg-muted text-xs uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">{t.transaction}</th>
                  <th scope="col" className="px-4 py-3 text-right">{t.amount}</th>
                  <th scope="col" className="px-4 py-3 text-center">{t.status}</th>
                  <th scope="col" className="px-4 py-3 text-left">{t.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTransactions.map((transaction) => {
                  const status = getTransactionStatus();
                  const accountName = findAccount(transaction.accountId)?.name || 'Unknown Account';
                  const isIncome = transaction.type === 'income';
                  const icon = getTransactionIcon(transaction.type);
                  
                  return (
                    <motion.tr 
                      key={transaction.id} 
                      className="bg-card hover:bg-card-hover transition-colors"
                      whileHover={{ 
                        backgroundColor: "rgba(59, 130, 246, 0.05)", 
                        transition: { duration: 0.2 } 
                      }}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center" aria-hidden="true">
                            <span>{icon}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">{transaction.description || 'Transaction'}</span>
                            <p className="text-xs text-muted-foreground">{accountName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} aria-label={`${isIncome ? 'Income' : 'Expense'} of ${Math.abs(transaction.amount).toFixed(2)}`}>
                          {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
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
                          <span className="inline-block w-2 h-2 rounded-full mr-1 bg-current" aria-hidden="true"></span>
                          <span>{status}</span>
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}; 