import { FC } from 'react';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

const accountsTranslations = {
  en: {
    bankAccounts: 'Bank Accounts',
    totalCurrentBalance: 'Total Current Balance',
    addBank: 'Add bank',
  },
  ru: {
    bankAccounts: 'Банковские счета',
    totalCurrentBalance: 'Текущий общий баланс',
    addBank: 'Добавить банк',
  }
};

interface AccountsSectionProps {
  locale: Locale;
}

export const AccountsSection: FC<AccountsSectionProps> = ({ locale }) => {
  const t = accountsTranslations[locale] || accountsTranslations.en;
  
  // Mock data for accounts
  const accounts = {
    count: 2,
    totalBalance: 2698.12,
  };
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{accounts.count} {t.bankAccounts}</h2>
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
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">${accounts.totalBalance.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Account details */}
        <div className="flex-1 w-full md:w-auto">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                  CB
                </div>
                <div>
                  <p className="font-medium">Chase Bank</p>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold">$2,588.12</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-1 rounded">savings</span>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold">
                  BA
                </div>
                <div>
                  <p className="font-medium">Bank of America</p>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold">$110.00</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded">checking</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 