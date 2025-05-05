'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Card, CardHeader, CardBody, CardFooter,
  Button, Badge, FinancialSummaryCard, TransactionCard, Dialog
} from '@/shared/ui';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Locale } from '@/shared/lib/i18n';
import { Account, accountApi } from '@/entities/account/api/accountApi';
import { transactionApi, Transaction } from '@/entities/transaction/api/transactionApi';
import { AccountQuickModal } from '@/features/transaction/ui/AccountQuickModal';
import { FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

// Translations for account detail page
const translations = {
  en: {
    accountDetails: 'Account Details',
    balance: 'Balance',
    overview: 'Overview',
    transactions: 'Transactions',
    analytics: 'Analytics',
    settings: 'Settings',
    balanceOverTime: 'Balance Over Time',
    transactionHistory: 'Transaction History',
    spendingByCategory: 'Spending by Category',
    incomeByCategory: 'Income by Category',
    backToAccounts: 'Back to accounts',
    editAccount: 'Edit Account',
    deleteAccount: 'Delete Account',
    confirmDelete: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete this account? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    today: 'Today',
    yesterday: 'Yesterday',
    days7: 'Last 7 days',
    days30: 'Last 30 days',
    days90: 'Last 90 days',
    all: 'All Time',
    custom: 'Custom',
    viewAll: 'View all',
    emptyTransactions: 'No transactions found for this account',
    loadingAccount: 'Loading account details...',
    errorAccount: 'Error loading account details',
    loadingTransactions: 'Loading transactions...',
    errorTransactions: 'Error loading transactions',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    currentBalance: 'Current Balance',
    accountType: 'Account Type',
    accountCurrency: 'Currency',
  },
  ru: {
    accountDetails: 'Детали счета',
    balance: 'Баланс',
    overview: 'Обзор',
    transactions: 'Транзакции',
    analytics: 'Аналитика',
    settings: 'Настройки',
    balanceOverTime: 'Баланс за период',
    transactionHistory: 'История транзакций',
    spendingByCategory: 'Расходы по категориям',
    incomeByCategory: 'Доходы по категориям',
    backToAccounts: 'Вернуться к счетам',
    editAccount: 'Редактировать счет',
    deleteAccount: 'Удалить счет',
    confirmDelete: 'Подтвердить удаление',
    confirmDeleteMessage: 'Вы уверены, что хотите удалить этот счет? Это действие нельзя отменить.',
    cancel: 'Отмена',
    delete: 'Удалить',
    today: 'Сегодня',
    yesterday: 'Вчера',
    days7: 'Последние 7 дней',
    days30: 'Последние 30 дней',
    days90: 'Последние 90 дней',
    all: 'За все время',
    custom: 'Пользовательский',
    viewAll: 'Смотреть все',
    emptyTransactions: 'Для этого счета не найдено транзакций',
    loadingAccount: 'Загрузка данных счета...',
    errorAccount: 'Ошибка загрузки данных счета',
    loadingTransactions: 'Загрузка транзакций...',
    errorTransactions: 'Ошибка загрузки транзакций',
    totalIncome: 'Общий доход',
    totalExpenses: 'Общие расходы',
    currentBalance: 'Текущий баланс',
    accountType: 'Тип счета',
    accountCurrency: 'Валюта',
  }
};

interface AccountDetailPageProps {
  params: {
    locale: Locale;
    accountId: string;
  };
}

export const AccountDetailPage = ({ params }: AccountDetailPageProps) => {
  const { locale, accountId } = params;
  const t = translations[locale as keyof typeof translations] || translations.en;
  const router = useRouter();
  
  // State management
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('days30');
  
  // Fetch account data
  useEffect(() => {
    async function fetchAccountData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const accountData = await accountApi.getById(accountId);
        setAccount(accountData);
      } catch (err) {
        console.error('Error fetching account data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load account data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAccountData();
  }, [accountId]);
  
  // Fetch transactions for this account
  useEffect(() => {
    async function fetchTransactions() {
      setIsTransactionsLoading(true);
      setTransactionsError(null);
      
      try {
        // Calculate date range based on selected time period
        const filters: { accountId: string; dateFrom?: string } = { accountId };
        
        if (timeRange !== 'all') {
          const dateFrom = new Date();
          
          switch (timeRange) {
            case 'today':
              dateFrom.setHours(0, 0, 0, 0);
              break;
            case 'yesterday':
              dateFrom.setDate(dateFrom.getDate() - 1);
              dateFrom.setHours(0, 0, 0, 0);
              break;
            case 'days7':
              dateFrom.setDate(dateFrom.getDate() - 7);
              break;
            case 'days30':
              dateFrom.setDate(dateFrom.getDate() - 30);
              break;
            case 'days90':
              dateFrom.setDate(dateFrom.getDate() - 90);
              break;
            default:
              break;
          }
          
          filters.dateFrom = dateFrom.toISOString();
        }
        
        const transactionsData = await transactionApi.getAll(filters);
        setTransactions(transactionsData);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setTransactionsError(err instanceof Error ? err.message : 'Failed to load transactions');
      } finally {
        setIsTransactionsLoading(false);
      }
    }
    
    if (accountId) {
      fetchTransactions();
    }
  }, [accountId, timeRange]);
  
  // Handle account delete
  const handleDeleteAccount = async () => {
    try {
      await accountApi.delete(accountId);
      router.push(`/${locale}/dashboard/accounts`);
    } catch (err) {
      console.error('Error deleting account:', err);
      // Could display an error toast here
    }
  };
  
  // Handle account edit
  const handleEditAccount = () => {
    if (account) {
      setIsAccountModalOpen(true);
    }
  };
  
  // Calculate summary data
  const summaryData = useMemo(() => {
    const result = {
      totalIncome: 0,
      totalExpenses: 0,
    };
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        result.totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        result.totalExpenses += transaction.amount;
      }
    });
    
    return result;
  }, [transactions]);
  
  // Prepare chart data for balance over time
  const balanceChartData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Sort transactions by date (oldest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate running balance
    let runningBalance = account?.balance || 0;
    
    // For accurate running balance, we need to subtract all transaction amounts
    // from the current balance to get the starting balance
    sortedTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        runningBalance -= transaction.amount;
      } else if (transaction.type === 'expense') {
        runningBalance += transaction.amount;
      }
    });
    
    // Create chart data points with running balance calculation
    const startingBalance = runningBalance;
    const dataPoints: { date: string; balance: number }[] = [];
    
    // Add starting point
    if (sortedTransactions.length > 0) {
      const firstDate = new Date(sortedTransactions[0].date);
      firstDate.setDate(firstDate.getDate() - 1);
      dataPoints.push({
        date: firstDate.toISOString().split('T')[0],
        balance: startingBalance
      });
    }
    
    // Add data points for each transaction date
    sortedTransactions.reduce((balance, transaction) => {
      let newBalance = balance;
      
      if (transaction.type === 'income') {
        newBalance += transaction.amount;
      } else if (transaction.type === 'expense') {
        newBalance -= transaction.amount;
      }
      
      // Check if we already have a data point for this date
      const dateStr = new Date(transaction.date).toISOString().split('T')[0];
      const existingPoint = dataPoints.find(p => p.date === dateStr);
      
      if (existingPoint) {
        existingPoint.balance = newBalance;
      } else {
        dataPoints.push({
          date: dateStr,
          balance: newBalance
        });
      }
      
      return newBalance;
    }, startingBalance);
    
    // Add end point with current balance
    dataPoints.push({
      date: new Date().toISOString().split('T')[0],
      balance: account?.balance || 0
    });
    
    return dataPoints;
  }, [transactions, account?.balance]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="py-6 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            className="mr-2"
            onClick={() => router.push(`/${locale}/dashboard/accounts`)}
          >
            <FiArrowLeft className="mr-2" />
            {t.backToAccounts}
          </Button>
        </div>
        <Card>
          <CardBody>
            <div className="flex justify-center items-center p-8">
              <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  // Error state
  if (error || !account) {
    return (
      <div className="py-6 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            className="mr-2"
            onClick={() => router.push(`/${locale}/dashboard/accounts`)}
          >
            <FiArrowLeft className="mr-2" />
            {t.backToAccounts}
          </Button>
        </div>
        <Card>
          <CardBody>
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
              {error || t.errorAccount}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header with back button and account title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            className="mr-2"
            onClick={() => router.push(`/${locale}/dashboard/accounts`)}
          >
            <FiArrowLeft className="mr-2" />
            {t.backToAccounts}
          </Button>
          <h1 className="text-2xl font-bold">{account.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditAccount}
            leftIcon={<FiEdit2 />}
          >
            {t.editAccount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            leftIcon={<FiTrash2 />}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
          >
            {t.deleteAccount}
          </Button>
        </div>
      </div>
      
      {/* Account Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FinancialSummaryCard
          title={t.currentBalance}
          value={account.balance}
          icon={<Wallet />}
          subtitle={account.currency}
        />
        <FinancialSummaryCard
          title={t.totalIncome}
          value={summaryData.totalIncome}
          icon={<TrendingUp />}
          subtitle={account.currency}
          className="bg-success/10"
        />
        <FinancialSummaryCard
          title={t.totalExpenses}
          value={summaryData.totalExpenses}
          icon={<TrendingDown />}
          subtitle={account.currency}
          className="bg-error/10"
        />
      </div>
      
      {/* Account Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <h2 className="text-xl font-semibold">{t.accountDetails}</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.accountType}</span>
                <Badge variant="secondary">
                  {account.type || 'Standard'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.accountCurrency}</span>
                <span className="font-medium">{account.currency}</span>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Balance Over Time Chart */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold">{t.balanceOverTime}</h2>
            <div className="flex flex-wrap mt-2 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="days7">{t.days7}</option>
                <option value="days30">{t.days30}</option>
                <option value="days90">{t.days90}</option>
                <option value="all">{t.all}</option>
              </select>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={balanceChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${account.currency} ${value}`, t.balance]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Recent Transactions Section */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t.transactionHistory}</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/${locale}/dashboard/transactions?accountId=${accountId}`)}
          >
            {t.viewAll}
          </Button>
        </CardHeader>
        <CardBody>
          {isTransactionsLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="w-8 h-8 border-t-4 border-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : transactionsError ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
              {transactionsError}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t.emptyTransactions}
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TransactionCard
                    id={transaction.id}
                    description={transaction.description}
                    amount={transaction.amount}
                    date={new Date(transaction.date)}
                    category={transaction.categoryId}
                    type={transaction.type as 'income' | 'expense' | 'transfer' | 'debt_give' | 'debt_take' | 'debt_repay'}
                    account={transaction.accountId}
                    onClick={() => router.push(`/${locale}/dashboard/transactions/${transaction.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </CardBody>
        {transactions.length > 5 && (
          <CardFooter className="flex justify-center border-t border-border pt-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push(`/${locale}/dashboard/transactions?accountId=${accountId}`)}
            >
              {t.viewAll}
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={t.confirmDelete}
        primaryActionText={t.delete}
        onPrimaryAction={handleDeleteAccount}
      >
        <p className="text-muted-foreground mb-4">
          {t.confirmDeleteMessage}
        </p>
        <div className="p-4 bg-card-hover rounded-md">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{account.name}</span>
            <span className="font-bold">{account.currency} {account.balance.toFixed(2)}</span>
          </div>
        </div>
      </Dialog>
      
      {/* Account Edit Modal */}
      <AccountQuickModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        initialData={{
          id: account.id,
          name: account.name,
          balance: account.balance,
          currency: account.currency,
          accountTypeId: account.accountTypeId,
        }}
        onSuccess={() => {
          setIsAccountModalOpen(false);
          // Refresh account data
          accountApi.getById(accountId).then(setAccount);
        }}
        locale={locale}
      />
    </div>
  );
}; 