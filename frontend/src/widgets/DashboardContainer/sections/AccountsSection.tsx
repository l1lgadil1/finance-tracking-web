import { FC } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useDashboardData } from '../providers/DashboardDataProvider';

const accountsTranslations = {
  en: {
    bankAccounts: 'Bank Accounts',
    totalCurrentBalance: 'Total Current Balance',
    addBank: 'Add bank',
    loading: 'Loading accounts...',
    error: 'Error loading accounts',
    noAccounts: 'No accounts found. Add your first account to get started.',
  },
  ru: {
    bankAccounts: 'Банковские счета',
    totalCurrentBalance: 'Текущий общий баланс',
    addBank: 'Добавить банк',
    loading: 'Загрузка счетов...',
    error: 'Ошибка загрузки счетов',
    noAccounts: 'Счета не найдены. Добавьте первый счет, чтобы начать.',
  }
};

// Get account type label based on account type
const getAccountTypeLabel = (type: string, locale: string): { text: string, bgClass: string } => {
  if (locale === 'ru') {
    switch (type) {
      case 'cash': return { text: 'наличные', bgClass: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' };
      case 'bank': return { text: 'банк', bgClass: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' };
      case 'credit': return { text: 'кредит', bgClass: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' };
      default: return { text: 'другое', bgClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' };
    }
  }
  
  switch (type) {
    case 'cash': return { text: 'cash', bgClass: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' };
    case 'bank': return { text: 'bank', bgClass: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' };
    case 'credit': return { text: 'credit', bgClass: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' };
    default: return { text: 'other', bgClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' };
  }
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

interface AccountsSectionProps {
  locale: Locale;
}

export const AccountsSection: FC<AccountsSectionProps> = ({ locale }) => {
  const t = accountsTranslations[locale] || accountsTranslations.en;
  const { accounts, totalBalance } = useDashboardData();
  
  // Loading state
  if (accounts.loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.bankAccounts}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (accounts.error) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.bankAccounts}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {accounts.error}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Empty state
  if (accounts.data.length === 0) {
    return (
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">0 {t.bankAccounts}</h2>
          </div>
          <Button variant="ghost" size="sm">
            <span className="mr-1">+</span> {t.addBank}
          </Button>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 text-center rounded-md">
            {t.noAccounts}
          </div>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{accounts.data.length} {t.bankAccounts}</h2>
        </div>
        <Button variant="ghost" size="sm">
          <span className="mr-1">+</span> {t.addBank}
        </Button>
      </CardHeader>
      <CardBody className="flex flex-col md:flex-row items-center gap-6">
        {/* Donut chart placeholder */}
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-full border-[16px] border-gray-200 dark:border-gray-700"></div>
          <div 
            className="absolute inset-0 rounded-full border-[16px] border-t-primary-500 border-r-primary-500 border-b-primary-300 border-l-primary-300"
            style={{ 
              transform: 'rotate(-45deg)',
            }}
          ></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.totalCurrentBalance}</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">${totalBalance.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Account details */}
        <div className="flex-1 w-full md:w-auto">
          <div className="space-y-4">
            {accounts.data.map((account) => {
              const typeLabel = getAccountTypeLabel(account.type, locale);
              const initials = getAccountInitials(account.name);
              
              return (
                <motion.div 
                  key={account.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                      {account.icon || initials}
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-primary-600 dark:text-primary-400 font-semibold">${account.balance.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className={`text-xs ${typeLabel.bgClass} px-2 py-1 rounded`}>{typeLabel.text}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 