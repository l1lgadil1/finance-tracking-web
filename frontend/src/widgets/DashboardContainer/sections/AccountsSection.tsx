import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useDashboardData } from '../providers/DashboardDataProvider';
import { AccountQuickModal } from '@/features/transaction/ui/AccountQuickModal';
import { Account } from '@/entities/account/api/accountApi';

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

interface AccountModalData {
  id?: string;
  name?: string;
  balance?: number;
  currency?: string;
  type?: 'cash' | 'bank' | 'credit';
  accountTypeId?: string;
}

export const AccountsSection: FC<AccountsSectionProps> = ({ locale }) => {
  const t = accountsTranslations[locale] || accountsTranslations.en;
  const { accounts, totalBalance, refresh } = useDashboardData();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<AccountModalData | undefined>(undefined);
  
  const handleAddBankClick = () => {
    setEditAccount(undefined);
    setIsAccountModalOpen(true);
  };

  const handleAccountEdit = (account: Account) => {
    // Transform Account to AccountModalData format
    setEditAccount({
      id: account.id,
      name: account.name,
      balance: account.balance,
      currency: account.currency,
      type: account.type,
      // Note: accountTypeId may need to be populated if available in your Account model
    });
    setIsAccountModalOpen(true);
  };

  const handleModalSuccess = () => {
    refresh();
  };
  
  // Loading state
  if (accounts.loading) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.bankAccounts}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8" aria-live="polite" aria-busy="true">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin" role="progressbar" aria-label={t.loading}></div>
            <span className="sr-only">{t.loading}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (accounts.error) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.bankAccounts}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md" role="alert" aria-live="assertive">
            {accounts.error}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Empty state
  if (accounts.data.length === 0) {
    return (
      <>
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">0 {t.bankAccounts}</h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleAddBankClick}
            aria-label={t.addBank}
          >
            <span className="mr-1" aria-hidden="true">+</span> {t.addBank}
          </Button>
        </CardHeader>
        <CardBody>
          <div className="p-6 bg-background text-foreground text-center rounded-md">
            {t.noAccounts}
          </div>
        </CardBody>
      </Card>
        
      <AccountQuickModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        initialData={editAccount}
        locale={locale as 'en' | 'ru'}
        onSuccess={handleModalSuccess}
      />
      </>
    );
  }
  
  return (
    <>
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{accounts.data.length} {t.bankAccounts}</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleAddBankClick}
          aria-label={t.addBank}
        >
          <span className="mr-1" aria-hidden="true">+</span> {t.addBank}
        </Button>
      </CardHeader>
      <CardBody className="flex flex-col md:flex-row items-center gap-6">
        {/* Donut chart placeholder */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0" aria-label={t.totalCurrentBalance}>
          <div className="absolute inset-0 rounded-full border-[16px] border-border"></div>
          <div 
            className="absolute inset-0 rounded-full border-[16px] border-t-primary-500 border-r-primary-500 border-b-primary-300 border-l-primary-300"
            style={{ 
              transform: 'rotate(-45deg)',
            }}
            aria-hidden="true"
          ></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">{t.totalCurrentBalance}</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">${totalBalance.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Account details */}
        <div className="flex-1 w-full md:w-auto">
          <div className="space-y-3">
            {accounts.data.map((account) => {
              const typeLabel = getAccountTypeLabel(account.type || 'other', locale);
              const initials = getAccountInitials(account.name || '');
              
              return (
                <motion.div 
                  key={account.id}
                  className="p-4 bg-background rounded-lg flex justify-between items-center cursor-pointer hover:bg-card-hover transition-colors"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => handleAccountEdit(account)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Edit account ${account.name || ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleAccountEdit(account);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold" aria-hidden="true">
                      {account.icon || initials}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{account.name || ''}</p>
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
      
    <AccountQuickModal 
      isOpen={isAccountModalOpen} 
      onClose={() => setIsAccountModalOpen(false)} 
      initialData={editAccount}
      locale={locale as 'en' | 'ru'}
      onSuccess={handleModalSuccess}
    />
    </>
  );
}; 