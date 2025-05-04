'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';
import { FiPlus, FiEdit2, FiExternalLink } from 'react-icons/fi';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import Link from 'next/link';
import { useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { AccountQuickModal } from '@/features/transaction/ui/AccountQuickModal';
import { Account } from '@/entities/account/api/accountApi';
import { useQuery } from '@tanstack/react-query';
import { accountTypeApi } from '@/entities/account/api/accountTypeApi';
import { DashboardDataProvider } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { Locale } from '@/shared/lib/i18n';

// Translations for the account page
const translations = {
  en: {
    accounts: 'Accounts',
    totalBalance: 'Total Balance',
    addAccount: 'Add Account',
    editAccount: 'Edit Account',
    deleteAccount: 'Delete Account',
    viewTransactions: 'View Transactions',
    filter: 'Filter',
    filterByType: 'Filter by Type',
    filterByProfile: 'Filter by Profile',
    filterByCurrency: 'Filter by Currency',
    all: 'All',
    cash: 'Cash',
    bank: 'Bank',
    credit: 'Credit',
    ewallet: 'E-Wallet',
    personal: 'Personal',
    business: 'Business',
    family: 'Family',
    fundsDistribution: 'Funds Distribution',
    aiSuggestions: 'AI Suggestions',
    connectBank: 'Connect Your Bank',
    connectBankInfo: 'Automatically sync your transactions by connecting your bank account.',
    loadingAccounts: 'Loading accounts...',
    errorAccounts: 'Error loading accounts',
    noAccounts: 'No accounts found. Add your first account to get started.',
    settings: 'Settings',
  },
  ru: {
    accounts: 'Счета',
    totalBalance: 'Общий баланс',
    addAccount: 'Добавить счет',
    editAccount: 'Редактировать счет',
    deleteAccount: 'Удалить счет',
    viewTransactions: 'Просмотр транзакций',
    filter: 'Фильтр',
    filterByType: 'Фильтр по типу',
    filterByProfile: 'Фильтр по профилю',
    filterByCurrency: 'Фильтр по валюте',
    all: 'Все',
    cash: 'Наличные',
    bank: 'Банк',
    credit: 'Кредит',
    ewallet: 'Электронный кошелек',
    personal: 'Личный',
    business: 'Бизнес',
    family: 'Семейный',
    fundsDistribution: 'Распределение средств',
    aiSuggestions: 'ИИ-рекомендации',
    connectBank: 'Подключить банк',
    connectBankInfo: 'Автоматически синхронизируйте свои транзакции, подключив свой банковский счет.',
    loadingAccounts: 'Загрузка счетов...',
    errorAccounts: 'Ошибка загрузки счетов',
    noAccounts: 'Счета не найдены. Добавьте первый счет, чтобы начать.',
    settings: 'Настройки',
  }
};

// Default account type colors for the pie chart
const defaultTypeColors = {
  cash: '#10b981', // success green
  bank: '#0073ff', // primary blue
  credit: '#8b5cf6', // purple
  ewallet: '#f59e0b' // warning yellow
};

// Get initials from account name for the avatar
const getAccountInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Filter types
type FilterType = 'all' | string;
type CurrencyType = 'all' | string;

interface AccountModalData {
  id?: string;
  name?: string;
  balance?: number;
  currency?: string;
  accountTypeId?: string;
}

function AccountsPageContent() {
  // Get the locale from the URL
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const t = translations[locale as keyof typeof translations] || translations.en;
  const { theme } = useTheme();
  
  // State management
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<AccountModalData | undefined>(undefined);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterCurrency, setFilterCurrency] = useState<CurrencyType>('all');
  
  // Fetch account types from API
  const { data: accountTypes, isLoading: isAccountTypesLoading, isError: isAccountTypesError } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: accountTypeApi.getAll,
  });
  
  // Fetch account data
  const { accounts, totalBalance, aiRecommendations, refresh } = useDashboardData();

  // Helper to get account type label and style based on backend data
  const getAccountTypeLabel = (accountTypeId: string): { text: string, bgClass: string } => {
    if (!accountTypes) {
      return { text: 'unknown', bgClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' };
    }
    
    const accountType = accountTypes.find(type => type.id === accountTypeId);
    if (!accountType) {
      return { text: 'unknown', bgClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' };
    }
    
    // Map account type to appropriate styling
    const typeName = accountType.name.toLowerCase();
    if (typeName.includes('cash')) {
      return { 
        text: locale === 'ru' ? 'наличные' : 'cash', 
        bgClass: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
      };
    } else if (typeName.includes('bank')) {
      return { 
        text: locale === 'ru' ? 'банк' : 'bank', 
        bgClass: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
      };
    } else if (typeName.includes('credit')) {
      return { 
        text: locale === 'ru' ? 'кредит' : 'credit', 
        bgClass: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' 
      };
    } else if (typeName.includes('wallet') || typeName.includes('e-wallet')) {
      return { 
        text: locale === 'ru' ? 'эл. кошелек' : 'e-wallet', 
        bgClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' 
      };
    }
    
    // Default case
    return { 
      text: accountType.name, 
      bgClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' 
    };
  };

  // Get account type color for charts
  const getAccountTypeColor = (accountTypeId: string): string => {
    if (!accountTypes) return '#64748b'; // default gray
    
    const accountType = accountTypes.find(type => type.id === accountTypeId);
    if (!accountType) return '#64748b';
    
    const typeName = accountType.name.toLowerCase();
    if (typeName.includes('cash')) return defaultTypeColors.cash;
    if (typeName.includes('bank')) return defaultTypeColors.bank;
    if (typeName.includes('credit')) return defaultTypeColors.credit;
    if (typeName.includes('wallet')) return defaultTypeColors.ewallet;
    
    return '#64748b'; // default gray
  };

  // Filter accounts based on the selected filters
  const filteredAccounts = useMemo(() => {
    if (!accounts.data) return [];
    
    return accounts.data.filter(account => {
      // Filter by type
      if (filterType !== 'all' && account.accountTypeId !== filterType) return false;
      
      // Filter by currency
      if (filterCurrency !== 'all' && account.currency !== filterCurrency) return false;
      
      return true;
    });
  }, [accounts.data, filterType, filterCurrency]);

  // Calculate data for the pie chart
  const pieChartData = useMemo(() => {
    if (!accounts.data || accounts.data.length === 0 || !accountTypes) return [];
    
    // Group accounts by type and sum their balances
    const groupedData: Record<string, number> = {};
    const typeNames: Record<string, string> = {};
    
    accounts.data.forEach(account => {
      const typeId = account.accountTypeId || 'other';
      
      if (!groupedData[typeId]) {
        groupedData[typeId] = 0;
        const accountType = accountTypes.find(t => t.id === typeId);
        typeNames[typeId] = accountType ? accountType.name : 'Other';
      }
      
      groupedData[typeId] += account.balance;
    });
    
    // Convert to array format for the pie chart
    return Object.entries(groupedData).map(([typeId, value]) => ({
      id: typeId,
      name: typeNames[typeId],
      value
    }));
  }, [accounts.data, accountTypes]);

  // Handle account edit
  const handleAccountEdit = (account: Account) => {
    setEditAccount({
      id: account.id,
      name: account.name,
      balance: account.balance,
      currency: account.currency,
      accountTypeId: account.accountTypeId,
    });
    setIsAccountModalOpen(true);
  };

  // Handle new account creation
  const handleAddAccountClick = () => {
    setEditAccount(undefined);
    setIsAccountModalOpen(true);
  };

  // Handle account modal close
  const handleModalSuccess = () => {
    refresh();
  };

  // Get available currencies for filtering
  const availableCurrencies = useMemo(() => {
    if (!accounts.data) return [];
    
    const currencies = new Set<string>();
    accounts.data.forEach(account => {
      if (account.currency) {
        currencies.add(account.currency);
      }
    });
    
    return Array.from(currencies);
  }, [accounts.data]);

  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';

  // Loading state
  if (accounts.loading || isAccountTypesLoading) {
    return (
      <div className="py-6 px-4 md:px-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.accounts}</h1>
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
  if (accounts.error || isAccountTypesError) {
    return (
      <div className="py-6 px-4 md:px-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.accounts}</h1>
        <Card>
          <CardBody>
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
              {accounts.error || "Error loading account types"}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t.accounts}</h1>
        
        {/* Filter dropdown */}
        <div className="flex space-x-2">
          <div className="relative inline-block">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{t.all}</option>
              {accountTypes && accountTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          {availableCurrencies.length > 1 && (
            <div className="relative inline-block">
              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value as CurrencyType)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">{t.all}</option>
                {availableCurrencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      {/* Total Balance Section */}
      <Card className="mb-6">
        <CardBody className="flex flex-col md:flex-row items-center justify-between py-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mr-4">
              <RiMoneyDollarCircleLine className="w-8 h-8 text-primary-600 dark:text-primary-300" />
            </div>
            <div>
              <h2 className="text-lg text-gray-600 dark:text-gray-400">{t.totalBalance}</h2>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                ${totalBalance.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="primary" 
              onClick={handleAddAccountClick}
              leftIcon={<FiPlus />}
            >
              {t.addAccount}
            </Button>
          </div>
        </CardBody>
      </Card>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts List Column */}
        <div className="lg:col-span-2 space-y-4">
          {filteredAccounts.length === 0 ? (
            <Card>
              <CardBody>
                <div className="p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t.noAccounts}</p>
                  <Button 
                    variant="primary" 
                    onClick={handleAddAccountClick}
                    leftIcon={<FiPlus />}
                  >
                    {t.addAccount}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            filteredAccounts.map(account => {
              const typeLabel = getAccountTypeLabel(account.accountTypeId);
              const initials = getAccountInitials(account.name);
              
              return (
                <motion.div 
                  key={account.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Card className="overflow-visible">
                    <CardBody className="p-0">
                      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mr-4 text-primary-700 dark:text-primary-300 font-bold">
                            {account.icon || initials}
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{account.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs ${typeLabel.bgClass} px-2 py-1 rounded`}>
                                {typeLabel.text}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {account.currency}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            ${account.balance.toFixed(2)}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAccountEdit(account)}
                              aria-label={t.editAccount}
                            >
                              <FiEdit2 />
                            </Button>
                            <Link
                              href={`/${locale}/dashboard/transactions?accountId=${account.id}`}
                              passHref
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                rightIcon={<FiExternalLink />}
                              >
                                {t.viewTransactions}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
        
        {/* Side Column */}
        <div className="space-y-6">
          {/* Pie Chart */}
          {accounts.data.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="font-semibold">{t.fundsDistribution}</h2>
              </CardHeader>
              <CardBody>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getAccountTypeColor(entry.id)} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                          color: textColor,
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Chart Legend */}
                <div className="mt-4 space-y-2">
                  {pieChartData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: getAccountTypeColor(entry.id) }}
                      />
                      <span className="text-sm">
                        {entry.name}: ${entry.value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
          
          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold">{t.aiSuggestions}</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {aiRecommendations.loading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="w-8 h-8 border-t-2 border-primary-500 rounded-full animate-spin"></div>
                </div>
              ) : aiRecommendations.error ? (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md text-sm">
                  {aiRecommendations.error}
                </div>
              ) : aiRecommendations.data?.tips.length ? (
                aiRecommendations.data.tips.slice(0, 3).map((tip, index) => (
                  <motion.div 
                    key={`tip-${index}`} 
                    className="p-3 bg-background dark:bg-gray-800 rounded-lg text-sm"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {tip}
                  </motion.div>
                ))
              ) : (
                <div className="p-3 bg-background dark:bg-gray-800 rounded-lg text-sm">
                  No suggestions available at this time.
                </div>
              )}
            </CardBody>
          </Card>
          
          {/* Bank Integration Placeholder */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold">{t.connectBank}</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t.connectBankInfo}
              </p>
              <Button variant="outline" fullWidth>
                {t.connectBank}
              </Button>
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
          onClick={handleAddAccountClick}
        >
          <FiPlus className="w-6 h-6" />
        </motion.button>
      </div>
      
      {/* Account Modal */}
      <AccountQuickModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        initialData={editAccount}
        locale={locale as 'en' | 'ru'}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

export default function AccountsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale as string || 'en') as Locale;
  
  return (
    <DashboardDataProvider locale={locale}>
      <AccountsPageContent />
    </DashboardDataProvider>
  );
} 