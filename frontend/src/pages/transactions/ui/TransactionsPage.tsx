import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowLeft, FiSearch, FiSettings, FiX } from 'react-icons/fi';
import { Card, CardBody } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { FinancialSummaryCard } from '@/shared/ui/FinancialSummaryCard';
import { Dialog } from '@/shared/ui/Dialog';
import { TransactionDetail } from '@/shared/ui/TransactionDetail';
import { DollarSign, ArrowUpDown, TrendingUp } from 'lucide-react';
import { TransactionFilter } from '@/widgets/TransactionFilter';
import { TransactionsList } from '@/widgets/TransactionsList';
import { useTransactionStore } from '@/entities/transaction/model/transactionStore';
import { Locale } from '@/shared/lib/i18n';
import { TransactionModal } from '@/features/transaction/ui/TransactionModal';
import { TransactionType } from '@/shared/constants/finance';
import { Transaction } from '@/shared/api/types';
import Link from 'next/link';

interface TransactionsPageProps {
  locale: Locale;
}

// Translations
const translations = {
  en: {
    transactions: 'Transactions',
    backToDashboard: 'Back to Dashboard',
    addTransaction: 'Add Transaction',
    search: 'Search transactions...',
    viewOptions: 'View Options',
    compactView: 'Compact View',
    detailedView: 'Detailed View',
    showBalance: 'Show Balance',
    groupByDate: 'Group by Date',
    summary: 'Summary',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    netBalance: 'Net Balance',
    viewAnalytics: 'View Analytics',
    transactionDetails: 'Transaction Details',
    confirmDelete: 'Confirm Delete',
    deleteConfirmationMessage: 'Are you sure you want to delete this transaction? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit'
  },
  ru: {
    transactions: 'Транзакции',
    backToDashboard: 'Назад к панели',
    addTransaction: 'Добавить транзакцию',
    search: 'Поиск транзакций...',
    viewOptions: 'Настройки отображения',
    compactView: 'Компактный вид',
    detailedView: 'Подробный вид',
    showBalance: 'Показать баланс',
    groupByDate: 'Группировать по дате',
    summary: 'Сводка',
    totalIncome: 'Общий доход',
    totalExpenses: 'Общие расходы',
    netBalance: 'Чистый баланс',
    viewAnalytics: 'Смотреть аналитику',
    transactionDetails: 'Детали транзакции',
    confirmDelete: 'Подтвердите удаление',
    deleteConfirmationMessage: 'Вы уверены, что хотите удалить эту транзакцию? Это действие нельзя отменить.',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Изменить'
  }
};

export function TransactionsPage({ locale }: TransactionsPageProps) {
  const searchParams = useSearchParams();
  const t = translations[locale];
  
  // Global state from Zustand store
  const { 
    transactions,
    statistics,
    isLoading,
    error,
    currentTransaction,
    filters,
    displayMode,
    groupByDate,
    showBalance,
    fetchTransactions,
    fetchTransactionById,
    deleteTransaction,
    setFilters,
    resetFilters,
    setDisplayMode,
    setGroupByDate,
    setShowBalance,
    fetchStatistics,
  } = useTransactionStore();

  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [defaultTransactionType, setDefaultTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  // Initialize with account filter from URL if present
  useEffect(() => {
    const accountId = searchParams ? searchParams.get('accountId') : null;
    
    if (accountId) {
      setFilters({ accountId });
    }
    
    // Initially fetch transactions and statistics
    fetchTransactions();
    fetchStatistics();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update transactions when filters change
  useEffect(() => {
    fetchTransactions();
    fetchStatistics(filters.startDate, filters.endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Search handler with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        setFilters({ search: searchTerm });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, setFilters]);

  // Handle opening transaction details
  const handleViewTransaction = async (id: string) => {
    setSelectedTransactionId(id);
    await fetchTransactionById(id);
    setIsDetailModalOpen(true);
  };

  // Handle edit transaction
  const handleEditTransaction = async (id: string) => {
    setSelectedTransactionId(id);
    await fetchTransactionById(id);
    setTransactionToEdit(currentTransaction);
    setIsTransactionModalOpen(true);
  };

  // Handle transaction deletion confirmation
  const handleConfirmDelete = (id: string) => {
    setSelectedTransactionId(id);
    setIsDeleteModalOpen(true);
  };

  // Delete transaction after confirmation
  const handleDeleteTransaction = async () => {
    if (selectedTransactionId) {
      await deleteTransaction(selectedTransactionId);
      
      // Refresh transaction list after successful deletion
      fetchTransactions();
      fetchStatistics(filters.startDate, filters.endDate);
      
      setIsDeleteModalOpen(false);
      setSelectedTransactionId(null);
      
      // If the detail modal was open, close it as well
      if (isDetailModalOpen) {
        setIsDetailModalOpen(false);
      }
    }
  };

  // Add new transaction
  const handleAddTransaction = () => {
    // Reset any existing transaction to edit
    setTransactionToEdit(null);
    // Open transaction modal
    setDefaultTransactionType(TransactionType.EXPENSE);
    setIsTransactionModalOpen(true);
  };

  // Toggle display settings
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // If there's an error, show it
  if (error) {
    return (
      <div className="py-6 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href={`/${locale}/dashboard`} className="mr-4">
            <Button variant="ghost" size="sm" leftIcon={<FiArrowLeft />}>
              {t.backToDashboard}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t.transactions}</h1>
        </div>
        <Card className="overflow-hidden border-red-200 dark:border-red-800">
          <CardBody>
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md flex items-center">
              <div className="mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>{error}</div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href={`/${locale}/dashboard`} className="mr-4">
              <Button 
                variant="ghost" 
                size="sm" 
                leftIcon={<FiArrowLeft className="transition-transform group-hover:-translate-x-1" />}
                className="group"
              >
                {t.backToDashboard}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.transactions}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<FiSettings className="group-hover:rotate-45 transition-transform duration-300" />}
              onClick={toggleSettings}
              aria-label={t.viewOptions}
              className="group"
            >
              <span className="hidden sm:inline">{t.viewOptions}</span>
            </Button>
            
            <Button 
              variant="primary" 
              leftIcon={<FiPlus className="group-hover:rotate-90 transition-transform duration-300" />}
              onClick={handleAddTransaction}
              className="group"
            >
              <span className="hidden sm:inline">{t.addTransaction}</span>
            </Button>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full relative">
            <Input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<FiSearch />}
              rightIcon={
                searchTerm ? (
                  <FiX 
                    className="cursor-pointer hover:text-primary-500 transition-colors" 
                    onClick={() => setSearchTerm('')}
                  />
                ) : undefined
              }
              fullWidth
              className="transition-all duration-200 focus-within:shadow-md"
            />
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <TransactionFilter 
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={resetFilters}
              accounts={[]} // Pass real accounts data here
              categories={[]} // Pass real categories data here
              locale={locale}
            />
            
            {/* Settings Dropdown */}
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-4 sm:right-0 top-24 sm:top-32 mt-2 w-64 bg-card shadow-lg rounded-lg border border-border z-20"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">{t.viewOptions}</h3>
                    <button 
                      onClick={toggleSettings}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="viewMode" className="text-sm font-medium">
                        {displayMode === 'compact' ? t.compactView : t.detailedView}
                      </label>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="viewMode"
                          checked={displayMode === 'detailed'}
                          onChange={() => setDisplayMode(displayMode === 'compact' ? 'detailed' : 'compact')}
                          className="sr-only"
                        />
                        <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                        <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform transform ${displayMode === 'detailed' ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="showBalance" className="text-sm font-medium">{t.showBalance}</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="showBalance"
                          checked={showBalance}
                          onChange={() => setShowBalance(!showBalance)}
                          className="sr-only"
                        />
                        <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                        <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform transform ${showBalance ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="groupByDate" className="text-sm font-medium">{t.groupByDate}</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="groupByDate"
                          checked={groupByDate}
                          onChange={() => setGroupByDate(!groupByDate)}
                          className="sr-only"
                        />
                        <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                        <div className={`absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full transition-transform transform ${groupByDate ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Financial Summary */}
          {showBalance && (
            <Card className="mb-6 overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardBody className="p-4">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <div className="w-full mb-4 lg:mb-0">
                    <h3 className="font-medium text-lg mb-3">{t.summary}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.totalIncome}</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          +${(statistics.totalIncome).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.totalExpenses}</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          -${(statistics.totalExpense).toFixed(2)}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        statistics.balance >= 0 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' 
                          : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800'
                      }`}>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.netBalance}</p>
                        <p className={`text-lg font-bold ${statistics.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          ${(statistics.balance).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/${locale}/dashboard/analytics`} passHref className="lg:ml-4">
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                      {t.viewAnalytics}
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          )}
          
          {/* Transactions List */}
          <div className="bg-transparent">
            <TransactionsList 
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleConfirmDelete}
              onView={handleViewTransaction}
              displayMode={displayMode}
              groupByDate={groupByDate}
              isLoading={isLoading}
              locale={locale}
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {/* Financial Summary Cards */}
          <div className="space-y-4 sticky top-6">
            <FinancialSummaryCard 
              title={t.totalIncome}
              value={statistics.totalIncome}
              subtitle={filters.startDate ? new Date(filters.startDate).toLocaleDateString() : ''}
              icon={<DollarSign size={20} className="text-green-500" />}
              change={{ value: 0, positive: true }}
              className="transition-transform hover:-translate-y-1 duration-300"
            />
            
            <FinancialSummaryCard 
              title={t.totalExpenses}
              value={statistics.totalExpense}
              subtitle={filters.endDate ? new Date(filters.endDate).toLocaleDateString() : ''}
              icon={<ArrowUpDown size={20} className="text-red-500" />}
              change={{ value: 0, positive: false }}
              className="transition-transform hover:-translate-y-1 duration-300"
            />
            
            <FinancialSummaryCard 
              title={t.netBalance}
              value={statistics.balance}
              subtitle=""
              icon={<TrendingUp size={20} className={statistics.balance >= 0 ? "text-blue-500" : "text-amber-500"} />}
              change={{ value: 0, positive: statistics.balance >= 0 }}
              className="transition-transform hover:-translate-y-1 duration-300"
            />
          </div>
        </div>
      </div>
      
      {/* Floating Add Button (Mobile) */}
      <div className="fixed right-6 bottom-6 md:hidden z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-colors"
          onClick={handleAddTransaction}
          aria-label={t.addTransaction}
        >
          <FiPlus className="w-6 h-6" />
        </motion.button>
      </div>
      
      {/* Transaction Detail Modal */}
      <Dialog
        className='w-full max-w-2xl mx-auto'
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={t.transactionDetails}
      >
        {currentTransaction && (
          <TransactionDetail
            id={currentTransaction.id}
            description={currentTransaction.description || ''}
            amount={currentTransaction.amount}
            date={new Date(currentTransaction.date)}
            category={currentTransaction.categoryId || ''}
            categoryName={currentTransaction.categoryName || ''}
            type={currentTransaction.type as 'income' | 'expense' | 'transfer' | 'debt_give' | 'debt_take' | 'debt_repay'}
            account={currentTransaction.accountId || ''}
            accountName={currentTransaction.accountName || ''}
            fromAccountName={currentTransaction.fromAccountName || ''}
            toAccountName={currentTransaction.toAccountName || ''}
            notes=""
            onEdit={() => {
              setIsDetailModalOpen(false);
              handleEditTransaction(currentTransaction.id);
            }}
            onDelete={() => {
              setIsDetailModalOpen(false);
              handleConfirmDelete(currentTransaction.id);
            }}
          />
        )}
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t.confirmDelete}
        primaryActionText={t.delete}
        onPrimaryAction={handleDeleteTransaction}
        className="max-w-md mx-auto"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{t.deleteConfirmationMessage}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentTransaction?.description && `"${currentTransaction.description}" - $${currentTransaction.amount.toFixed(2)}`}
            </p>
          </div>
        </div>
      </Dialog>

      {/* Add/Edit Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setTransactionToEdit(null);
        }}
        onSuccess={() => {
          // Refresh transaction list after successful creation/update
          fetchTransactions();
          fetchStatistics(filters.startDate, filters.endDate);
        }}
        locale={locale}
        defaultTransactionType={defaultTransactionType}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
} 