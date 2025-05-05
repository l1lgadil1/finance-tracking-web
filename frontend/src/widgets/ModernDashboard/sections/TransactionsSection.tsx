import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardHeader, CardBody } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { TransactionCard } from '@/shared/ui';
import { useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
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

// Define valid transaction types for the component
type ValidTransactionType = 'income' | 'expense' | 'transfer' | 'debt_give' | 'debt_take' | 'debt_repay';

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
  
  // Helper to map transaction type to component prop
  const mapTransactionType = (type: string): ValidTransactionType => {
    if (type === 'income') return 'income';
    if (type === 'expense') return 'expense';
    if (type === 'transfer') return 'transfer';
    // Map specific debt types
    if (type === 'debt_give' || type.includes('debt_give')) return 'debt_give';
    if (type === 'debt_take' || type.includes('debt_take')) return 'debt_take';
    if (type === 'debt_repay' || type.includes('debt_repay')) return 'debt_repay';
    // Default to expense for any unknown types
    return 'expense';
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
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold" 
                  style={{ backgroundColor: 'var(--primary-100)' }}
                  aria-hidden="true"
                >
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
        
        {/* Transactions list */}
        {recentTransactions.length > 0 && (
          <div>
            {recentTransactions.map((transaction) => {
              const accountName = findAccount(transaction.accountId)?.name || 'Unknown Account';
              
              return (
                <motion.div
                  key={transaction.id}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  transition={{ duration: 0.2 }}
                  className="p-2 bg-card hover:bg-card-hover transition-colors"
                >
                  <TransactionCard
                    id={transaction.id}
                    description={transaction.description || 'Transaction'}
                    amount={transaction.amount}
                    date={new Date(transaction.date)}
                    category={transaction.category?.name || 'Uncategorized'}
                    type={mapTransactionType(transaction.type)}
                    account={accountName}
                    onClick={() => console.log(`Transaction ${transaction.id} clicked`)}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}; 