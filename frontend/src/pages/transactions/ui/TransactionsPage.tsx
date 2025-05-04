import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
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
  const handleEditTransaction = (id: string) => {
    // Redirect to edit page or open edit modal
    router.push(`/${locale}/dashboard/transactions/edit/${id}`);
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
    // Redirect to add page or open add modal
    router.push(`/${locale}/dashboard/transactions/new`);
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
        <Card>
          <CardBody>
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
              {error}
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
              <Button variant="ghost" size="sm" leftIcon={<FiArrowLeft />}>
                {t.backToDashboard}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{t.transactions}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<FiSettings />}
              onClick={toggleSettings}
              aria-label={t.viewOptions}
            >
              {t.viewOptions}
            </Button>
            
            <Button 
              variant="primary" 
              leftIcon={<FiPlus />}
              onClick={handleAddTransaction}
            >
              {t.addTransaction}
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
                    className="cursor-pointer" 
                    onClick={() => setSearchTerm('')}
                  />
                ) : undefined
              }
              fullWidth
            />
          </div>
          
          <div className="flex items-center gap-2 self-end">
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
                className="absolute right-0 top-32 mt-2 w-56 bg-card shadow-lg rounded-lg border border-border z-10"
              >
                <div className="p-4">
                  <h3 className="font-medium mb-3">{t.viewOptions}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="viewMode" className="text-sm">
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
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${displayMode === 'detailed' ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="showBalance" className="text-sm">{t.showBalance}</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="showBalance"
                          checked={showBalance}
                          onChange={() => setShowBalance(!showBalance)}
                          className="sr-only"
                        />
                        <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${showBalance ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="groupByDate" className="text-sm">{t.groupByDate}</label>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="groupByDate"
                          checked={groupByDate}
                          onChange={() => setGroupByDate(!groupByDate)}
                          className="sr-only"
                        />
                        <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${groupByDate ? 'translate-x-4' : ''}`}></div>
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
            <Card className="mb-6">
              <CardBody className="p-4">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="font-medium text-lg mb-2">{t.summary}</h3>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">{t.totalIncome}</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          +${(statistics.totalIncome / 100).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t.totalExpenses}</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          -${(statistics.totalExpense / 100).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t.netBalance}</p>
                        <p className={`text-lg font-bold ${statistics.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          ${(statistics.balance / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/${locale}/dashboard/analytics`} passHref>
                    <Button variant="outline" size="sm">
                      {t.viewAnalytics}
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          )}
          
          {/* Transactions List */}
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
        
        <div className="lg:col-span-1">
          {/* Financial Summary Cards */}
          <div className="space-y-4">
            <FinancialSummaryCard 
              title={t.totalIncome}
              value={statistics.totalIncome / 100}
              subtitle={filters.startDate ? new Date(filters.startDate).toLocaleDateString() : ''}
              icon={<DollarSign size={20} />}
              change={{ value: 0, positive: true }}
            />
            
            <FinancialSummaryCard 
              title={t.totalExpenses}
              value={statistics.totalExpense / 100}
              subtitle={filters.endDate ? new Date(filters.endDate).toLocaleDateString() : ''}
              icon={<ArrowUpDown size={20} />}
              change={{ value: 0, positive: false }}
            />
            
            <FinancialSummaryCard 
              title={t.netBalance}
              value={statistics.balance / 100}
              subtitle=""
              icon={<TrendingUp size={20} />}
              change={{ value: 0, positive: statistics.balance >= 0 }}
            />
          </div>
        </div>
      </div>
      
      {/* Floating Add Button (Mobile) */}
      <div className="fixed right-6 bottom-6 md:hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-primary-500 text-white p-3 rounded-full shadow-lg"
          onClick={handleAddTransaction}
        >
          <FiPlus className="w-6 h-6" />
        </motion.button>
      </div>
      
      {/* Transaction Detail Modal */}
      <Dialog
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
            type={currentTransaction.type as 'income' | 'expense' | 'transfer' | 'debt'}
            account={currentTransaction.accountId || ''}
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
      >
        <p>{t.deleteConfirmationMessage}</p>
      </Dialog>
    </div>
  );
} 