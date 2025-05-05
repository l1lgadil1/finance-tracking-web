import { FC } from 'react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardHeader, CardBody } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useDashboardData } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { CreditCard, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const accountsTranslations = {
  en: {
    accounts: 'Accounts',
    viewAll: 'View All',
    availableBalance: 'Available balance',
    accountNumber: 'Account number',
    lastUpdated: 'Last updated',
    transfer: 'Transfer',
    viewTransactions: 'View',
    loading: 'Loading accounts...',
    error: 'Error loading accounts',
    noAccounts: 'No accounts found',
    addAccount: 'Add Account'
  },
  ru: {
    accounts: 'Счета',
    viewAll: 'Все счета',
    availableBalance: 'Доступный баланс',
    accountNumber: 'Номер счета',
    lastUpdated: 'Последнее обновление',
    transfer: 'Перевод',
    viewTransactions: 'Просмотр',
    loading: 'Загрузка счетов...',
    error: 'Ошибка загрузки счетов',
    noAccounts: 'Счета не найдены',
    addAccount: 'Добавить счет'
  }
};

// Colors for accounts when no color is provided
const accountColors = [
  'var(--primary-500)',
  'var(--success-500)',
  'var(--info-500)',
  'var(--warning-500)',
  'var(--error-500)',
  'var(--secondary-500)',
];

// Extended Account interface with optional color property
interface ExtendedAccount {
  id: string;
  name: string;
  balance: number;
  color?: string;
}

interface AccountsSectionProps {
  locale: Locale;
}

export const AccountsSection: FC<AccountsSectionProps> = ({ locale }) => {
  const t = accountsTranslations[locale] || accountsTranslations.en;
  const { accounts, isLoading, hasErrors } = useDashboardData();
  
  // Helper to safely get account color
  const getAccountColor = (account: ExtendedAccount, index: number): string => {
    // If account has color property, use it
    if (account.color) return account.color;
    
    // Otherwise assign from our palette based on index
    return accountColors[index % accountColors.length];
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.accounts}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
            <span className="sr-only">{t.loading}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (hasErrors) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.accounts}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {accounts.error || t.error}
          </div>
        </CardBody>
      </Card>
    );
  }
  
  // Empty state
  if (!accounts.data || accounts.data.length === 0) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.accounts}</h2>
        </CardHeader>
        <CardBody className="text-center p-8">
          <p className="text-muted-foreground mb-4">{t.noAccounts}</p>
          <Button variant="primary">{t.addAccount}</Button>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t.accounts}</h2>
        <Link href={`/${locale}/dashboard/accounts`} passHref>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            {t.viewAll}
            <ArrowUpRight size={14} />
          </Button>
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {accounts.data.map((account, index) => {
            // Get account color
            const accountColor = getAccountColor(account, index);
            
            return (
              <motion.div 
                key={account.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-all"
              >
                {/* Color bar on top */}
                <div 
                  className="h-2 w-full" 
                  style={{ backgroundColor: accountColor }}
                ></div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300"
                        style={{ backgroundColor: 'var(--primary-100)' }}
                      >
                        <CreditCard size={16} />
                      </div>
                      <h3 className="font-medium">{account.name}</h3>
                    </div>
                    <Badge 
                      variant="success"
                      className="text-xs px-2 py-0.5"
                    >
                      Active
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.availableBalance}</p>
                      <p className="text-xl font-bold">
                        ${account.balance.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t.accountNumber}</span>
                      <span>•••• {Math.floor(1000 + Math.random() * 9000)}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t.lastUpdated}</span>
                      <span>Today</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">{t.transfer}</Button>
                    <Button variant="primary" size="sm">{t.viewTransactions}</Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}; 