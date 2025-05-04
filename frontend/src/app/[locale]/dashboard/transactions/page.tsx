'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { FiArrowLeft, FiPlus, FiCalendar, FiFilter, FiSearch, FiX, FiSettings, FiMoreHorizontal, FiDollarSign, FiChevronDown, FiChevronUp, FiEdit2 } from 'react-icons/fi';
import Link from 'next/link';
import { Locale } from '@/shared/lib/i18n';
import { DashboardDataProvider, useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { TransactionModal } from '@/features/transaction/ui/TransactionModal';
import { useQuery } from '@tanstack/react-query';
import { accountTypeApi } from '@/entities/account/api/accountTypeApi';

// Translations for the transactions page
const translations = {
  en: {
    transactions: 'Transactions',
    backToDashboard: 'Back to Dashboard',
    backToAccounts: 'Back to Accounts',
    addTransaction: 'Add Transaction',
    filterTransactions: 'Filter',
    search: 'Search transactions...',
    filterByDate: 'Date',
    filterByType: 'Type',
    filterByCategory: 'Category',
    filterByAccount: 'Account',
    filterByAmount: 'Amount',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply',
    from: 'From',
    to: 'To',
    minAmount: 'Min',
    maxAmount: 'Max',
    all: 'All',
    income: 'Income',
    expense: 'Expense',
    transfer: 'Transfer',
    debt: 'Debt',
    debtRepayment: 'Debt Repayment',
    loadingTransactions: 'Loading transactions...',
    errorTransactions: 'Error loading transactions',
    noTransactions: 'No transactions found.',
    transaction: 'Transaction',
    amount: 'Amount',
    status: 'Status',
    date: 'Date',
    category: 'Category',
    account: 'Account',
    description: 'Description',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    custom: 'Custom Range',
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
    aiInsights: 'AI Insights',
    askAi: 'Ask AI',
    aiPlaceholder: 'Example: "Show my transportation expenses for this month"',
    unusualSpending: 'Unusual Spending',
    savingOpportunity: 'Saving Opportunity',
    viewSimilar: 'View Similar',
  },
  ru: {
    transactions: 'Транзакции',
    backToDashboard: 'Назад к панели',
    backToAccounts: 'Назад к счетам',
    addTransaction: 'Добавить транзакцию',
    filterTransactions: 'Фильтр',
    search: 'Поиск транзакций...',
    filterByDate: 'Дата',
    filterByType: 'Тип',
    filterByCategory: 'Категория',
    filterByAccount: 'Счет',
    filterByAmount: 'Сумма',
    clearFilters: 'Очистить',
    applyFilters: 'Применить',
    from: 'От',
    to: 'До',
    minAmount: 'Мин',
    maxAmount: 'Макс',
    all: 'Все',
    income: 'Доход',
    expense: 'Расход',
    transfer: 'Перевод',
    debt: 'Долг',
    debtRepayment: 'Погашение долга',
    loadingTransactions: 'Загрузка транзакций...',
    errorTransactions: 'Ошибка загрузки транзакций',
    noTransactions: 'Транзакции не найдены.',
    transaction: 'Транзакция',
    amount: 'Сумма',
    status: 'Статус',
    date: 'Дата',
    category: 'Категория',
    account: 'Счет',
    description: 'Описание',
    today: 'Сегодня',
    yesterday: 'Вчера',
    thisWeek: 'Эта неделя',
    thisMonth: 'Этот месяц',
    lastMonth: 'Прошлый месяц',
    custom: 'Произвольный диапазон',
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
    aiInsights: 'ИИ-рекомендации',
    askAi: 'Спросить ИИ',
    aiPlaceholder: 'Например: "Показать расходы на транспорт за этот месяц"',
    unusualSpending: 'Необычные расходы',
    savingOpportunity: 'Возможность сэкономить',
    viewSimilar: 'Показать похожие',
  }
};

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
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
const getTransactionStatus = (): string => {
  // This would normally come from the transaction data
  // but for simplicity, we're randomizing here
  const statuses = ['success', 'processing', 'failed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Filter types
type FilterType = 'all' | string;
type DateFilterType = 'all' | 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'custom';
type ViewMode = 'compact' | 'detailed';

// Interface for advanced filters
interface AdvancedFilters {
  startDate: string | null;
  endDate: string | null;
  categoryIds: string[];
  accountIds: string[];
  minAmount: number | null;
  maxAmount: number | null;
  searchTerm: string;
}

function TransactionsPageContent() {
  // Get the locale and account ID from the URL
  const params = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const locale = params?.locale || 'en';
  const accountId = searchParams ? searchParams.get('accountId') : null;
  const t = translations[locale as keyof typeof translations] || translations.en;
  
  // State management
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterDate, setFilterDate] = useState<DateFilterType>('all');
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [showBalance, setShowBalance] = useState(true);
  const [groupByDate, setGroupByDate] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  
  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    startDate: null,
    endDate: null,
    categoryIds: [],
    accountIds: accountId ? [accountId] : [],
    minAmount: null,
    maxAmount: null,
    searchTerm: '',
  });
  
  // Temporary filters for the filter panel
  const [tempFilters, setTempFilters] = useState<AdvancedFilters>({...advancedFilters});
  
  // Fetch account types from API
  const { isLoading: isAccountTypesLoading } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: accountTypeApi.getAll,
  });
  
  // Fetch transactions and accounts data
  const { transactions, accounts, categories } = useDashboardData();

  // Find the account if accountId is provided
  const selectedAccount = accountId && accounts.data
    ? accounts.data.find(account => account.id === accountId)
    : null;
    
  // Handle click outside of filter panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsAdvancedFilterOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set initial filter based on the accountId
  useEffect(() => {
    // If there's an accountId in the URL, filter transactions by that account
    if (accountId) {
      setAdvancedFilters(prev => ({
        ...prev,
        accountIds: [accountId],
      }));
      setTempFilters(prev => ({
        ...prev,
        accountIds: [accountId],
      }));
    }
  }, [accountId]);
  
  // Helper functions for date filters
  const getDateRange = (filterType: DateFilterType): { start: Date | null, end: Date | null } => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    endOfLastMonth.setHours(23, 59, 59, 999);
    
    switch (filterType) {
      case 'today':
        return { 
          start: new Date(today.setHours(0, 0, 0, 0)), 
          end: today 
        };
      case 'yesterday':
        return { 
          start: yesterday, 
          end: new Date(yesterday.getTime()).setHours(23, 59, 59, 999) as unknown as Date 
        };
      case 'thisWeek':
        return { 
          start: startOfWeek, 
          end: today 
        };
      case 'thisMonth':
        return { 
          start: startOfMonth, 
          end: today 
        };
      case 'lastMonth':
        return { 
          start: startOfLastMonth, 
          end: endOfLastMonth 
        };
      case 'custom':
        return {
          start: advancedFilters.startDate ? new Date(advancedFilters.startDate) : null,
          end: advancedFilters.endDate ? new Date(advancedFilters.endDate) : null,
        };
      default:
        return { start: null, end: null };
    }
  };

  // Filter transactions based on the selected filters and account
  const filteredTransactions = transactions.data.filter(transaction => {
    // Filter by search term
    if (advancedFilters.searchTerm) {
      const searchLower = advancedFilters.searchTerm.toLowerCase();
      const descriptionMatch = transaction.description?.toLowerCase().includes(searchLower);
      const categoryMatch = transaction.category?.name?.toLowerCase().includes(searchLower);
      
      if (!descriptionMatch && !categoryMatch) return false;
    }
    
    // Filter by account IDs
    if (advancedFilters.accountIds.length > 0) {
      if (!advancedFilters.accountIds.includes(transaction.accountId)) return false;
    }
    
    // Filter by category IDs
    if (advancedFilters.categoryIds.length > 0) {
      if (!transaction.categoryId || !advancedFilters.categoryIds.includes(transaction.categoryId)) return false;
    }
    
    // Filter by type
    if (filterType !== 'all' && transaction.type !== filterType) return false;
    
    // Filter by amount range
    if (advancedFilters.minAmount !== null && transaction.amount < advancedFilters.minAmount) return false;
    if (advancedFilters.maxAmount !== null && transaction.amount > advancedFilters.maxAmount) return false;
    
    // Filter by date
    if (filterDate !== 'all') {
      const dateRange = getDateRange(filterDate);
      const transactionDate = new Date(transaction.date);
      
      if (dateRange.start && transactionDate < dateRange.start) return false;
      if (dateRange.end && transactionDate > dateRange.end) return false;
    }
    
    return true;
  });
  
  // Group transactions by date for display
  const groupedTransactions = groupByDate 
    ? filteredTransactions.reduce((groups, transaction) => {
        const date = new Date(transaction.date).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
      }, {} as Record<string, typeof filteredTransactions>)
    : { 'all': filteredTransactions };
  
  // Sort transactions by date (most recent first)
  const sortedGroups = Object.entries(groupedTransactions)
    .sort(([dateA], [dateB]) => {
      if (dateA === 'all') return -1;
      if (dateB === 'all') return 1;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  // Calculate summary for filtered transactions
  const transactionSummary = filteredTransactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        summary.totalExpenses += transaction.amount;
      }
      
      return summary;
    },
    { totalIncome: 0, totalExpenses: 0, netBalance: 0 }
  );
  
  transactionSummary.netBalance = transactionSummary.totalIncome - transactionSummary.totalExpenses;

  // Apply filters from the advanced filter panel
  const applyAdvancedFilters = () => {
    setAdvancedFilters({...tempFilters});
    setIsAdvancedFilterOpen(false);
  };

  // Reset all filters
  const clearAllFilters = () => {
    const defaultFilters = {
      startDate: null,
      endDate: null,
      categoryIds: [],
      accountIds: accountId ? [accountId] : [],
      minAmount: null,
      maxAmount: null,
      searchTerm: '',
    };
    
    setTempFilters(defaultFilters);
    setAdvancedFilters(defaultFilters);
    setFilterType('all');
    setFilterDate('all');
  };

  // Open transaction modal
  const handleAddTransaction = () => {
    setIsTransactionModalOpen(true);
  };

  // Toggle view settings panel
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Helper to find account by id
  const findAccount = (accountId: string) => {
    return accounts.data.find(account => account.id === accountId);
  };

  // State for infinite scrolling
  const [visibleTransactionsCount, setVisibleTransactionsCount] = useState(20);
  
  // Load more transactions on scroll
  const handleLoadMore = () => {
    setVisibleTransactionsCount(prev => prev + 10);
  };
  
  // Intersection observer for infinite scrolling
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  // Container animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Translations for AI integration
  t.aiInsights = locale === 'ru' ? 'ИИ-рекомендации' : 'AI Insights';
  t.askAi = locale === 'ru' ? 'Спросить ИИ' : 'Ask AI';
  t.aiPlaceholder = locale === 'ru' ? 'Например: "Показать расходы на транспорт за этот месяц"' : 'Example: "Show my transportation expenses for this month"';
  t.unusualSpending = locale === 'ru' ? 'Необычные расходы' : 'Unusual Spending';
  t.savingOpportunity = locale === 'ru' ? 'Возможность сэкономить' : 'Saving Opportunity';
  t.viewSimilar = locale === 'ru' ? 'Показать похожие' : 'View Similar';
  
  // Mock AI insights for demo
  const aiInsights = [
    {
      id: 1,
      type: 'unusualSpending',
      message: locale === 'ru' 
        ? 'Ваши расходы на рестораны на 20% выше, чем обычно в этом месяце.'
        : 'Your restaurant spending is 20% higher than usual this month.',
      icon: '🍔',
      category: 'Food & Dining'
    },
    {
      id: 2,
      type: 'savingOpportunity',
      message: locale === 'ru'
        ? 'Вы могли бы сэкономить $45 в этом месяце, сократив расходы на подписки.'
        : 'You could save $45 this month by reducing subscription expenses.',
      icon: '💰',
      category: 'Subscriptions'
    }
  ];

  // Loading state
  if (transactions.loading || accounts.loading || isAccountTypesLoading) {
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
            <div className="flex justify-center items-center p-8">
              <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Error state
  if (transactions.error || accounts.error) {
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
              {transactions.error || accounts.error}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header Section with Back Button, Title, Search and Filter */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href={accountId ? `/${locale}/dashboard/accounts` : `/${locale}/dashboard`} className="mr-4">
              <Button variant="ghost" size="sm" leftIcon={<FiArrowLeft />}>
                {accountId ? t.backToAccounts : t.backToDashboard}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{t.transactions}</h1>
            {selectedAccount && (
              <span className="ml-2 text-gray-500">({selectedAccount.name})</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<FiSettings />}
              onClick={toggleSettings}
              aria-label={t.viewOptions}
            />
            
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
              value={advancedFilters.searchTerm}
              onChange={(e) => setAdvancedFilters({...advancedFilters, searchTerm: e.target.value})}
              leftIcon={<FiSearch />}
              rightIcon={
                advancedFilters.searchTerm ? (
                  <FiX 
                    className="cursor-pointer" 
                    onClick={() => setAdvancedFilters({...advancedFilters, searchTerm: ''})}
                  />
                ) : undefined
              }
              fullWidth
            />
          </div>
          
          <div className="flex items-center gap-2 self-end">
            <div className="relative" ref={filterRef}>
              <Button
                variant="outline"
                size="md"
                leftIcon={<FiFilter />}
                onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                className={isAdvancedFilterOpen ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
              >
                {t.filterTransactions}
                {Object.values(advancedFilters).some(v => 
                  (Array.isArray(v) && v.length > 0) || 
                  (typeof v === 'number' && v !== null) || 
                  (typeof v === 'string' && v !== '')
                ) && (
                  <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white rounded-full text-xs">
                    {
                      [
                        advancedFilters.accountIds.length > 0 ? 1 : 0,
                        advancedFilters.categoryIds.length > 0 ? 1 : 0,
                        filterType !== 'all' ? 1 : 0,
                        filterDate !== 'all' ? 1 : 0,
                        advancedFilters.minAmount !== null || advancedFilters.maxAmount !== null ? 1 : 0
                      ].reduce((a, b) => a + b, 0)
                    }
                  </span>
                )}
              </Button>
              
              {/* Advanced Filter Panel */}
              <AnimatePresence>
                {isAdvancedFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-72 sm:w-96 bg-card shadow-lg rounded-lg border border-border z-10"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">{t.filterTransactions}</h3>
                        <FiX 
                          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" 
                          onClick={() => setIsAdvancedFilterOpen(false)}
                        />
                      </div>
                      
                      {/* Transaction Type Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">{t.filterByType}</label>
                        <div className="grid grid-cols-3 gap-1 mb-3">
                          <Button
                            variant={filterType === 'all' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterType('all')}
                            className="w-full"
                          >
                            {t.all}
                          </Button>
                          <Button
                            variant={filterType === 'income' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterType('income')}
                            className="w-full"
                          >
                            {t.income}
                          </Button>
                          <Button
                            variant={filterType === 'expense' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterType('expense')}
                            className="w-full"
                          >
                            {t.expense}
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <Button
                            variant={filterType === 'transfer' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterType('transfer')}
                            className="w-full"
                          >
                            {t.transfer}
                          </Button>
                          <Button
                            variant={filterType === 'debt' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterType('debt')}
                            className="w-full"
                          >
                            {t.debt}
                          </Button>
                          <Button
                            variant={filterType === 'debt_repay' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterType('debt_repay')}
                            className="w-full text-xs"
                          >
                            {t.debtRepayment}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Date Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">{t.filterByDate}</label>
                        <div className="grid grid-cols-3 gap-1 mb-2">
                          <Button
                            variant={filterDate === 'all' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterDate('all')}
                            className="w-full"
                          >
                            {t.all}
                          </Button>
                          <Button
                            variant={filterDate === 'today' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterDate('today')}
                            className="w-full"
                          >
                            {t.today}
                          </Button>
                          <Button
                            variant={filterDate === 'yesterday' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterDate('yesterday')}
                            className="w-full"
                          >
                            {t.yesterday}
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-1 mb-2">
                          <Button
                            variant={filterDate === 'thisWeek' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterDate('thisWeek')}
                            className="w-full"
                          >
                            {t.thisWeek}
                          </Button>
                          <Button
                            variant={filterDate === 'thisMonth' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterDate('thisMonth')}
                            className="w-full"
                          >
                            {t.thisMonth}
                          </Button>
                          <Button
                            variant={filterDate === 'lastMonth' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterDate('lastMonth')}
                            className="w-full"
                          >
                            {t.lastMonth}
                          </Button>
                        </div>
                        
                        {/* Custom Date Range */}
                        <div className="mt-2">
                          <Button
                            variant={filterDate === 'custom' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterDate('custom')}
                            leftIcon={<FiCalendar />}
                            className="w-full mb-2"
                          >
                            {t.custom}
                          </Button>
                          
                          {filterDate === 'custom' && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">{t.from}</label>
                                <Input
                                  type="date"
                                  value={tempFilters.startDate || ''}
                                  onChange={(e) => setTempFilters({...tempFilters, startDate: e.target.value})}
                                  size="sm"
                                  fullWidth
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">{t.to}</label>
                                <Input
                                  type="date"
                                  value={tempFilters.endDate || ''}
                                  onChange={(e) => setTempFilters({...tempFilters, endDate: e.target.value})}
                                  size="sm"
                                  fullWidth
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Account Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">{t.filterByAccount}</label>
                        <div className="max-h-32 overflow-y-auto border border-border rounded-md p-1">
                          {accounts.data.map(account => (
                            <div key={account.id} className="flex items-center p-1">
                              <input
                                type="checkbox"
                                id={`account-${account.id}`}
                                checked={tempFilters.accountIds.includes(account.id)}
                                onChange={(e) => {
                                  const newIds = e.target.checked
                                    ? [...tempFilters.accountIds, account.id]
                                    : tempFilters.accountIds.filter(id => id !== account.id);
                                  setTempFilters({...tempFilters, accountIds: newIds});
                                }}
                                className="mr-2 h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                              />
                              <label htmlFor={`account-${account.id}`} className="text-sm">{account.name}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Category Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">{t.filterByCategory}</label>
                        <div className="max-h-32 overflow-y-auto border border-border rounded-md p-1">
                          {categories && categories.data && categories.data.length > 0 ? (
                            categories.data.map(category => (
                              <div key={category.id} className="flex items-center p-1">
                                <input
                                  type="checkbox"
                                  id={`category-${category.id}`}
                                  checked={tempFilters.categoryIds.includes(category.id)}
                                  onChange={(e) => {
                                    const newIds = e.target.checked
                                      ? [...tempFilters.categoryIds, category.id]
                                      : tempFilters.categoryIds.filter(id => id !== category.id);
                                    setTempFilters({...tempFilters, categoryIds: newIds});
                                  }}
                                  className="mr-2 h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor={`category-${category.id}`} className="text-sm">{category.name}</label>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 p-2">No categories available</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Amount Range Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">{t.filterByAmount}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">{t.minAmount}</label>
                            <Input
                              type="number"
                              value={tempFilters.minAmount || ''}
                              onChange={(e) => setTempFilters({...tempFilters, minAmount: e.target.value ? Number(e.target.value) : null})}
                              size="sm"
                              leftIcon={<FiDollarSign />}
                              min={0}
                              fullWidth
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">{t.maxAmount}</label>
                            <Input
                              type="number"
                              value={tempFilters.maxAmount || ''}
                              onChange={(e) => setTempFilters({...tempFilters, maxAmount: e.target.value ? Number(e.target.value) : null})}
                              size="sm"
                              leftIcon={<FiDollarSign />}
                              min={0}
                              fullWidth
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Filter Actions */}
                      <div className="flex justify-between mt-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                        >
                          {t.clearFilters}
                        </Button>
                        
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={applyAdvancedFilters}
                        >
                          {t.applyFilters}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* View Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-card shadow-lg rounded-lg border border-border z-10"
                  >
                    <div className="p-4">
                      <h3 className="font-medium mb-3">{t.viewOptions}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor="viewMode" className="text-sm">{viewMode === 'compact' ? t.compactView : t.detailedView}</label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              id="viewMode"
                              checked={viewMode === 'detailed'}
                              onChange={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
                              className="sr-only"
                            />
                            <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${viewMode === 'detailed' ? 'translate-x-4' : ''}`}></div>
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
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Analytics Snapshot / Summary */}
          {showBalance && (
            <Card className="mb-6">
              <CardBody className="p-4">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="font-medium text-lg mb-2">{t.summary}</h3>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">{t.totalIncome}</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">+${transactionSummary.totalIncome.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t.totalExpenses}</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">-${transactionSummary.totalExpenses.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t.netBalance}</p>
                        <p className={`text-lg font-bold ${transactionSummary.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          ${transactionSummary.netBalance.toFixed(2)}
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
          
          {/* Account info if filtered by account */}
          {selectedAccount && (
            <Card className="mb-6">
              <CardBody className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                  {selectedAccount.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <div>
                  <h2 className="font-medium text-lg">{selectedAccount.name}</h2>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold">
                    ${selectedAccount.balance.toFixed(2)} {selectedAccount.currency}
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
          
          {/* Transactions List */}
          {sortedGroups.length === 0 || (sortedGroups.length === 1 && sortedGroups[0][1].length === 0) ? (
            <Card>
              <CardBody>
                <div className="p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t.noTransactions}</p>
                  <Button 
                    variant="primary" 
                    onClick={handleAddTransaction}
                    leftIcon={<FiPlus />}
                  >
                    {t.addTransaction}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedGroups.slice(0, visibleTransactionsCount).map(([date, transactions]) => (
                <motion.div key={date} variants={itemVariants}>
                  <Card>
                    {date !== 'all' && (
                      <CardHeader className="flex justify-between items-center py-2 px-4 bg-bac dark:bg-gray-800">
                        <h3 className="font-semibold">
                          {formatDate(new Date(date).toISOString())}
                        </h3>
                        <Badge variant="primary" size="sm">
                          {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
                        </Badge>
                      </CardHeader>
                    )}
                    
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {transactions.map((transaction) => {
                        const account = findAccount(transaction.accountId);
                        
                        return (
                          <motion.div 
                            key={transaction.id} 
                            className="p-4 hover:bg-background dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            whileHover={{ 
                              backgroundColor: "rgba(59, 130, 246, 0.05)", 
                              transition: { duration: 0.2 } 
                            }}
                          >
                            {viewMode === 'detailed' ? (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center flex-wrap gap-2">
                                      <span className="font-medium truncate max-w-full sm:max-w-xs">{transaction.description || 'Transaction'}</span>
                                      <Badge 
                                        variant={
                                          transaction.type === 'income' ? 'success' : 
                                          transaction.type === 'expense' ? 'error' : 
                                          transaction.type === 'transfer' ? 'primary' :
                                          'warning'
                                        }
                                        size="sm"
                                      >
                                        {transaction.type === 'income' ? t.income : 
                                         transaction.type === 'expense' ? t.expense : 
                                         transaction.type === 'transfer' ? t.transfer : 
                                         transaction.type === 'debt' ? t.debt : 
                                         t.debtRepayment}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                                      {!groupByDate && (
                                        <span className="flex items-center gap-1">
                                          <FiCalendar className="text-gray-400" size={14} />
                                          {formatDate(transaction.date)}
                                        </span>
                                      )}
                                      
                                      <span className="flex items-center gap-1 truncate">
                                        {account && account.name}
                                      </span>
                                      
                                      {transaction.category && (
                                        <span className="flex items-center gap-1 truncate">
                                          {transaction.category.name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start mt-2 sm:mt-0 w-full sm:w-auto">
                                  <span className={`font-semibold text-lg ${
                                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 
                                    transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 
                                    'text-gray-800 dark:text-gray-200'
                                  }`}>
                                    {transaction.type === 'income' ? '+' : 
                                     transaction.type === 'expense' ? '-' : ''}
                                    ${Math.abs(transaction.amount).toFixed(2)}
                                  </span>
                                  <div className="flex mt-1 gap-2">
                                    <Button variant="ghost" size="xs">
                                      <FiEdit2 size={14} />
                                    </Button>
                                    <Button variant="ghost" size="xs">
                                      <FiMoreHorizontal size={14} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                                    <span>{getTransactionIcon(transaction.type)}</span>
                                  </div>
                                  <div className="truncate">
                                    <span className="font-medium text-sm truncate block">{transaction.description || 'Transaction'}</span>
                                    <p className="text-xs text-gray-500 truncate">
                                      {account?.name || 'Unknown'} • {formatDate(transaction.date)}
                                    </p>
                                  </div>
                                </div>
                                <span className={`font-medium ml-3 ${
                                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 
                                  transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 
                                  'text-gray-800 dark:text-gray-200'
                                }`}>
                                  {transaction.type === 'income' ? '+' : 
                                   transaction.type === 'expense' ? '-' : ''}
                                  ${Math.abs(transaction.amount).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {/* Infinite scrolling loader */}
              {sortedGroups.length > visibleTransactionsCount && (
                <div ref={loadMoreRef} className="flex justify-center py-4">
                  <div className="w-8 h-8 border-t-4 border-primary-500 rounded-full animate-spin"></div>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          {/* AI Integration Section */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h3 className="font-medium text-lg">{t.aiInsights}</h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="mb-4">
                <div className="relative">
                  <Input
                    placeholder={t.aiPlaceholder}
                    leftIcon={<FiSearch />}
                    fullWidth
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="absolute right-1 top-1 bottom-1"
                  >
                    {t.askAi}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {aiInsights.map(insight => (
                  <motion.div
                    key={insight.id}
                    className={`p-3 rounded-lg ${
                      insight.type === 'unusualSpending' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' 
                        : 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                    }`}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-lg">
                        {insight.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          insight.type === 'unusualSpending'
                            ? 'text-red-800 dark:text-red-300'
                            : 'text-green-800 dark:text-green-300'
                        }`}>
                          {insight.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{insight.category}</span>
                          <Button variant="ghost" size="xs">
                            {t.viewSimilar}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
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
      
      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        locale={locale as 'en' | 'ru'}
      />
    </div>
  );
}

export default function TransactionsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale as string || 'en') as Locale;
  
  return (
    <DashboardDataProvider locale={locale}>
      <TransactionsPageContent />
    </DashboardDataProvider>
  );
} 