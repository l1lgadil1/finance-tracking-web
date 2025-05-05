import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/ui/Button';
import { DatePicker } from '@/shared/ui/DatePicker';
import { AccountSelector } from '@/shared/ui/AccountSelector';
import { CategorySelector } from '@/shared/ui/CategorySelector';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { FiFilter, FiX } from 'react-icons/fi';
import { TransactionFilters } from '@/shared/api/transactions';
import { Account as ApiAccount, Category as ApiCategory } from '@/shared/api/types';
import { Locale } from '@/shared/lib/i18n';

interface TransactionFilterProps {
  filters: TransactionFilters;
  onFilterChange: (filters: Partial<TransactionFilters>) => void;
  onResetFilters: () => void;
  accounts: ApiAccount[];
  categories: ApiCategory[];
  locale: Locale;
}

// Translations for filter component
const translations = {
  en: {
    filter: 'Filter',
    filterByDate: 'Date',
    filterByType: 'Type',
    filterByCategory: 'Category',
    filterByAccount: 'Account',
    filterByAmount: 'Amount',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply',
    startDate: 'Start Date',
    endDate: 'End Date',
    minAmount: 'Min Amount',
    maxAmount: 'Max Amount',
    all: 'All',
    income: 'Income',
    expense: 'Expense',
    transfer: 'Transfer',
    debtGive: 'Debt Given',
    debtTake: 'Debt Taken',
    debtRepayment: 'Debt Repayment',
  },
  ru: {
    filter: 'Фильтр',
    filterByDate: 'Дата',
    filterByType: 'Тип',
    filterByCategory: 'Категория',
    filterByAccount: 'Счет',
    filterByAmount: 'Сумма',
    clearFilters: 'Очистить',
    applyFilters: 'Применить',
    startDate: 'Начальная дата',
    endDate: 'Конечная дата',
    minAmount: 'Мин. сумма',
    maxAmount: 'Макс. сумма',
    all: 'Все',
    income: 'Доход',
    expense: 'Расход',
    transfer: 'Перевод',
    debtGive: 'Выданный долг',
    debtTake: 'Взятый долг',
    debtRepayment: 'Погашение долга',
  }
};

// Convert API Account to UI Account
const mapApiAccountsToUiAccounts = (accounts: ApiAccount[]) => {
  return accounts.map(account => ({
    id: account.id,
    name: account.name,
    balance: account.balance,
    currency: 'USD', // Assuming USD as the default currency
    color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Generate random color
  }));
};

// Convert API Category to UI Category
const mapApiCategoriesToUiCategories = (categories: ApiCategory[]) => {
  return categories.map(category => ({
    id: category.id,
    name: category.name,
    icon: category.icon || '📂',
    color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Generate random color
    type: (category.type as 'income' | 'expense' | 'both') || 'both'
  }));
};

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  accounts,
  categories,
  locale
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<TransactionFilters>({...filters});
  const filterRef = useRef<HTMLDivElement>(null);
  const t = translations[locale];

  // Map API models to UI component models
  const uiAccounts = mapApiAccountsToUiAccounts(accounts);
  const uiCategories = mapApiCategoriesToUiCategories(categories);

  // Active filters count for badge
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.categoryId) count++;
    if (filters.type) count++;
    if (filters.accountId) count++;
    if (filters.minAmount !== undefined) count++;
    if (filters.maxAmount !== undefined) count++;
    if (filters.search && filters.search.trim() !== '') count++;
    return count;
  };

  // Handle click outside of filter panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset temp filters when actual filters change
  useEffect(() => {
    setTempFilters({...filters});
  }, [filters]);

  // Handle applying filters
  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setIsOpen(false);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    onResetFilters();
    setIsOpen(false);
  };

  // Start date change handler
  const handleStartDateChange = (date: Date | null) => {
    setTempFilters(prev => ({
      ...prev,
      startDate: date ? date.toISOString().split('T')[0] : undefined
    }));
  };

  // End date change handler
  const handleEndDateChange = (date: Date | null) => {
    setTempFilters(prev => ({
      ...prev,
      endDate: date ? date.toISOString().split('T')[0] : undefined
    }));
  };

  // Map transaction type for CategorySelector
  const mapTransactionTypeForCategorySelector = (type?: string): 'income' | 'expense' | 'transfer' | 'debt' | undefined => {
    if (!type) return undefined;
    
    if (type === 'income') return 'income';
    if (type === 'expense') return 'expense';
    if (type === 'transfer') return 'transfer';
    if (type === 'debt_give' || type === 'debt_take' || type === 'debt_repay') return 'debt';
    
    return undefined;
  };

  return (
    <div className="relative" ref={filterRef}>
      <Button
        variant="outline"
        size="md"
        leftIcon={<FiFilter />}
        onClick={() => setIsOpen(!isOpen)}
        className={isOpen ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
      >
        {t.filter}
        {getActiveFiltersCount() > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white rounded-full text-xs">
            {getActiveFiltersCount()}
          </span>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-card shadow-lg rounded-lg border border-border z-10"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{t.filter}</h3>
                <FiX 
                  className="cursor-pointer text-muted-foreground hover:text-foreground" 
                  onClick={() => setIsOpen(false)}
                />
              </div>
              
              {/* Transaction Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t.filterByType}</label>
                <div className="grid grid-cols-3 gap-1 mb-3">
                  <Button
                    variant={!tempFilters.type ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setTempFilters({...tempFilters, type: undefined})}
                    className="w-full"
                  >
                    {t.all}
                  </Button>
                  <Button
                    variant={tempFilters.type === 'income' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setTempFilters({...tempFilters, type: 'income'})}
                    className="w-full"
                  >
                    {t.income}
                  </Button>
                  <Button
                    variant={tempFilters.type === 'expense' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setTempFilters({...tempFilters, type: 'expense'})}
                    className="w-full"
                  >
                    {t.expense}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-1 mb-3">
                  <Button
                    variant={tempFilters.type === 'transfer' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setTempFilters({...tempFilters, type: 'transfer'})}
                    className="w-full"
                  >
                    {t.transfer}
                  </Button>
                  <Button
                    variant={tempFilters.type === 'debt_repay' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setTempFilters({...tempFilters, type: 'debt_repay'})}
                    className="w-full"
                  >
                    {t.debtRepayment}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    variant={tempFilters.type === 'debt_give' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setTempFilters({...tempFilters, type: 'debt_give'})}
                    className="w-full"
                  >
                    {t.debtGive}
                  </Button>
                  <Button
                    variant={tempFilters.type === 'debt_take' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setTempFilters({...tempFilters, type: 'debt_take'})}
                    className="w-full"
                  >
                    {t.debtTake}
                  </Button>
                </div>
              </div>
              
              {/* Date Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t.filterByDate}</label>
                <div className="grid grid-cols-2 gap-3">
                  <DatePicker
                    label={t.startDate}
                    value={tempFilters.startDate ? new Date(tempFilters.startDate) : null}
                    onChange={handleStartDateChange}
                    locale={locale}
                  />
                  <DatePicker
                    label={t.endDate}
                    value={tempFilters.endDate ? new Date(tempFilters.endDate) : null}
                    onChange={handleEndDateChange}
                    locale={locale}
                  />
                </div>
              </div>
              
              {/* Account Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t.filterByAccount}</label>
                <AccountSelector 
                  accounts={uiAccounts}
                  selectedAccountId={tempFilters.accountId}
                  onChange={(id) => setTempFilters({...tempFilters, accountId: id})}
                  label={t.filterByAccount}
                />
              </div>
              
              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t.filterByCategory}</label>
                <CategorySelector 
                  categories={uiCategories}
                  selectedCategoryId={tempFilters.categoryId}
                  onChange={(id) => setTempFilters({...tempFilters, categoryId: id})}
                  label={t.filterByCategory}
                  transactionType={mapTransactionTypeForCategorySelector(tempFilters.type)}
                />
              </div>
              
              {/* Amount Range Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t.filterByAmount}</label>
                <div className="grid grid-cols-2 gap-3">
                  <CurrencyInput
                    label={t.minAmount}
                    value={tempFilters.minAmount !== undefined ? tempFilters.minAmount : 0}
                    onChange={(value) => setTempFilters({...tempFilters, minAmount: value || undefined})}
                  />
                  <CurrencyInput
                    label={t.maxAmount}
                    value={tempFilters.maxAmount !== undefined ? tempFilters.maxAmount : 0}
                    onChange={(value) => setTempFilters({...tempFilters, maxAmount: value || undefined})}
                  />
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  {t.clearFilters}
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApplyFilters}
                >
                  {t.applyFilters}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 