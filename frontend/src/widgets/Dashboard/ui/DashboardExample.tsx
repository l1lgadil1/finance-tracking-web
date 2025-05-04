import React from 'react';
import { useTranslation } from 'next-i18next';
import { DashboardLayout, DashboardWidget } from './DashboardLayout';
import { FinancialSummaryCard, TransactionCard, ProgressBar } from '@/shared/ui';
import { Wallet, TrendingUp, ArrowUpDown, CreditCard } from 'lucide-react';

export interface DashboardExampleProps {
  className?: string;
}

const DashboardExample: React.FC<DashboardExampleProps> = ({ className = '' }) => {
  const { t } = useTranslation('common');

  // Example data
  const transactions = [
    {
      id: '1',
      amount: 12545, // In cents
      description: 'Grocery shopping',
      date: new Date(),
      category: 'Groceries',
      type: 'expense' as const,
      account: 'Credit Card',
    },
    {
      id: '2',
      amount: 150000, // In cents
      description: 'Salary payment',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      category: 'Salary',
      type: 'income' as const,
      account: 'Bank Account',
    },
    {
      id: '3',
      amount: 4599, // In cents
      description: 'Streaming subscription',
      date: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      category: 'Entertainment',
      type: 'expense' as const,
      account: 'Credit Card',
    },
  ];

  // Dashboard header
  const dashboardHeader = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <h1 className="text-2xl font-bold mb-2 md:mb-0">{t('Financial Dashboard')}</h1>
      <div className="flex space-x-2">
        <select className="bg-background border border-border rounded px-3 py-1 text-sm">
          <option value="all">{t('All Accounts')}</option>
          <option value="bank">{t('Bank Account')}</option>
          <option value="card">{t('Credit Card')}</option>
        </select>
        <select className="bg-background border border-border rounded px-3 py-1 text-sm">
          <option value="month">{t('This Month')}</option>
          <option value="quarter">{t('This Quarter')}</option>
          <option value="year">{t('This Year')}</option>
        </select>
      </div>
    </div>
  );

  // Top row summary cards
  const topRowWidgets = [
    <FinancialSummaryCard
      key="total-balance"
      title={t('Total Balance')}
      value="$4,520.50"
      subtitle={t('Across all accounts')}
      icon={<Wallet className="h-5 w-5" />}
      change={{ value: "2.5%", positive: true }}
    />,
    <FinancialSummaryCard
      key="total-income"
      title={t('Monthly Income')}
      value="$2,750.00"
      subtitle={t('This month')}
      icon={<TrendingUp className="h-5 w-5" />}
      change={{ value: "3.2%", positive: true }}
    />,
    <FinancialSummaryCard
      key="total-expenses"
      title={t('Monthly Expenses')}
      value="$1,820.75"
      subtitle={t('This month')}
      icon={<ArrowUpDown className="h-5 w-5" />}
      change={{ value: "1.8%", positive: false }}
    />,
    <FinancialSummaryCard
      key="credit-usage"
      title={t('Credit Usage')}
      value="$1,245.32"
      subtitle={t('Current balance')}
      icon={<CreditCard className="h-5 w-5" />}
      change={{ value: "0%", positive: true }}
    />,
  ];

  // Main content - Transactions list
  const mainContent = (
    <DashboardWidget title={t('Recent Transactions')}>
      <div className="space-y-3">
        {transactions.map(transaction => (
          <TransactionCard
            key={transaction.id}
            id={transaction.id}
            amount={transaction.amount}
            description={transaction.description}
            category={transaction.category}
            date={transaction.date}
            type={transaction.type}
            account={transaction.account}
            onClick={() => console.log(`Transaction clicked: ${transaction.id}`)}
          />
        ))}
        <button className="mt-2 text-primary hover:text-primary/80 text-sm font-medium w-full text-center py-2">
          {t('View All Transactions')}
        </button>
      </div>
    </DashboardWidget>
  );

  // Side widgets
  const sideWidgets = [
    <DashboardWidget key="budget" title={t('Budget Progress')}>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{t('Groceries')}</span>
            <span>$350 / $400</span>
          </div>
          <ProgressBar 
            value={87.5} 
            variant="success" 
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{t('Entertainment')}</span>
            <span>$120 / $150</span>
          </div>
          <ProgressBar 
            value={80} 
            variant="primary" 
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{t('Dining')}</span>
            <span>$280 / $250</span>
          </div>
          <ProgressBar 
            value={112} 
            variant="error" 
          />
        </div>
      </div>
    </DashboardWidget>,
    <DashboardWidget key="upcoming" title={t('Upcoming Bills')}>
      <ul className="space-y-2">
        <li className="flex justify-between items-center p-2 bg-accent/30 rounded">
          <div>
            <p className="font-medium">Netflix</p>
            <p className="text-sm text-muted-foreground">Jun 15, 2023</p>
          </div>
          <div className="text-right">
            <p className="font-medium">$14.99</p>
            <p className="text-xs text-muted-foreground">Auto-pay</p>
          </div>
        </li>
        <li className="flex justify-between items-center p-2 bg-accent/30 rounded">
          <div>
            <p className="font-medium">Rent</p>
            <p className="text-sm text-muted-foreground">Jun 30, 2023</p>
          </div>
          <div className="text-right">
            <p className="font-medium">$1,200</p>
            <p className="text-xs text-muted-foreground">Manual</p>
          </div>
        </li>
      </ul>
    </DashboardWidget>,
  ];

  // Bottom row widgets
  const bottomRowWidgets = [
    <DashboardWidget key="spending-categories" title={t('Spending by Category')}>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center justify-center p-3 bg-accent/30 rounded">
          <div className="w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center text-background mb-2">
            🛒
          </div>
          <p className="font-medium">Groceries</p>
          <p className="text-sm text-muted-foreground">$435.20</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-accent/30 rounded">
          <div className="w-8 h-8 rounded-full bg-[#F44336] flex items-center justify-center text-background mb-2">
            🎬
          </div>
          <p className="font-medium">Entertainment</p>
          <p className="text-sm text-muted-foreground">$132.45</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-accent/30 rounded">
          <div className="w-8 h-8 rounded-full bg-[#FF9800] flex items-center justify-center text-background mb-2">
            🍔
          </div>
          <p className="font-medium">Dining</p>
          <p className="text-sm text-muted-foreground">$287.30</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-accent/30 rounded">
          <div className="w-8 h-8 rounded-full bg-[#2196F3] flex items-center justify-center text-background mb-2">
            🚗
          </div>
          <p className="font-medium">Transport</p>
          <p className="text-sm text-muted-foreground">$165.80</p>
        </div>
      </div>
    </DashboardWidget>,
    <DashboardWidget key="monthly-summary" title={t('Monthly Summary')}>
      <div className="flex flex-col h-full justify-center">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-success/10 rounded">
            <p className="text-sm text-muted-foreground">{t('Total Income')}</p>
            <p className="text-xl font-bold text-success">$2,750.00</p>
          </div>
          <div className="p-3 bg-destructive/10 rounded">
            <p className="text-sm text-muted-foreground">{t('Total Expenses')}</p>
            <p className="text-xl font-bold text-destructive">$1,820.75</p>
          </div>
        </div>
        <div className="p-3 bg-primary/10 rounded">
          <p className="text-sm text-muted-foreground">{t('Net Savings')}</p>
          <p className="text-xl font-bold text-primary">$929.25</p>
          <p className="text-xs text-muted-foreground">{t('33.8% of income saved')}</p>
        </div>
      </div>
    </DashboardWidget>,
  ];

  return (
    <DashboardLayout
      className={className}
      headerContent={dashboardHeader}
      topRow={topRowWidgets}
      mainContent={mainContent}
      sideContent={sideWidgets}
      bottomRow={bottomRowWidgets}
    />
  );
};

export default DashboardExample; 