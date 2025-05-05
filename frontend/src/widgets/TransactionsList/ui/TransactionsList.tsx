import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { TransactionCard } from '@/shared/ui/TransactionCard';
import { Button } from '@/shared/ui/Button';
import { FiEdit2, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { Transaction } from '@/shared/api/types';
import { Locale } from '@/shared/lib/i18n';

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  displayMode: 'compact' | 'detailed';
  groupByDate: boolean;
  isLoading: boolean;
  locale: Locale;
}

// Translations for the transactions list
const translations = {
  en: {
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    earlier: 'Earlier',
    noTransactions: 'No transactions found.',
    loadingTransactions: 'Loading transactions...',
    transaction: 'transaction',
    transactions: 'transactions',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
  },
  ru: {
    today: 'Сегодня',
    yesterday: 'Вчера',
    thisWeek: 'Эта неделя',
    thisMonth: 'Этот месяц',
    lastMonth: 'Прошлый месяц',
    earlier: 'Ранее',
    noTransactions: 'Транзакции не найдены.',
    loadingTransactions: 'Загрузка транзакций...',
    transaction: 'транзакция',
    transactions: 'транзакций',
    edit: 'Изменить',
    delete: 'Удалить',
    view: 'Просмотр',
  }
};

// Get relative date label (Today, Yesterday, etc.)
const getRelativeDateLabel = (date: Date, t: Record<string, string>): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  if (dateOnly.getTime() === today.getTime()) {
    return t.today;
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return t.yesterday;
  }
  
  // This week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  // This month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Last month
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  
  if (dateOnly >= startOfWeek && dateOnly < today) {
    return t.thisWeek;
  } else if (dateOnly >= startOfMonth && dateOnly < startOfWeek) {
    return t.thisMonth;
  } else if (dateOnly >= startOfLastMonth && dateOnly <= endOfLastMonth) {
    return t.lastMonth;
  }
  
  return t.earlier;
};

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onEdit,
  onDelete,
  onView,
  displayMode,
  groupByDate,
  isLoading,
  locale
}) => {
  const [visibleCount, setVisibleCount] = useState(20);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const t = translations[locale];

  // Group transactions by date for display
  const groupedTransactions = groupByDate
    ? transactions.reduce((groups, transaction) => {
        // Get date without time for grouping
        const date = new Date(transaction.date);
        date.setHours(0, 0, 0, 0);
        const dateKey = date.toISOString().split('T')[0];
        
        if (!groups[dateKey]) {
          groups[dateKey] = {
            date,
            label: getRelativeDateLabel(date, t),
            transactions: []
          };
        }
        
        groups[dateKey].transactions.push(transaction);
        return groups;
      }, {} as Record<string, { date: Date; label: string; transactions: Transaction[] }>)
    : { 'all': { date: new Date(), label: '', transactions } };

  // Sort groups by date (most recent first)
  const sortedGroups = Object.values(groupedTransactions).sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });

  // Infinite scrolling setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && visibleCount < transactions.length) {
          setVisibleCount(prev => Math.min(prev + 10, transactions.length));
        }
      },
      { threshold: 0.5 }
    );
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [isLoading, transactions.length, visibleCount]);

  // Reset visible count when transactions change
  useEffect(() => {
    setVisibleCount(20);
  }, [transactions]);

  // Loading state
  if (isLoading && transactions.length === 0) {
    return (
      <Card className="border-0">
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <div className="w-8 h-8 border-t-4 border-primary-500 rounded-full animate-spin mr-3"></div>
            <p className="text-muted-foreground">{t.loadingTransactions}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <Card className="border-0">
        <CardBody>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">{t.noTransactions}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

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

  // Helper to get correct plural form
  const getTransactionText = (count: number) => {
    if (locale === 'ru') {
      // Russian has complex plural forms
      if (count % 10 === 1 && count % 100 !== 11) {
        return `${count} транзакция`;
      } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
        return `${count} транзакции`;
      } else {
        return `${count} транзакций`;
      }
    } else {
      // English has simple plural form
      return `${count} ${count === 1 ? t.transaction : t.transactions}`;
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {sortedGroups.slice(0, Math.ceil(visibleCount / 5)).map((group) => (
        <motion.div key={group.date.toISOString()} variants={itemVariants}>
          <Card className="mb-4 border-0 shadow-none bg-transparent">
            {groupByDate && (
              <CardHeader className="flex justify-between items-center py-2 px-4 bg-background">
                <h3 className="font-semibold">{group.label}</h3>
                <Badge variant="primary" size="sm">
                  {getTransactionText(group.transactions.length)}
                </Badge>
              </CardHeader>
            )}
            
            <CardBody className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
              {group.transactions.map((transaction) => (
                <div key={transaction.id} className="p-0">
                  <div className="relative group">
                    <TransactionCard
                      id={transaction.id}
                      description={transaction.description || 'Unnamed Transaction'}
                      amount={transaction.amount}
                      date={new Date(transaction.date)}
                      category={transaction.categoryId || ''}
                      categoryName={transaction.categoryName || ''}
                      type={transaction.type as 'income' | 'expense' | 'transfer' | 'debt_give' | 'debt_take' | 'debt_repay'}
                      account={transaction.accountId || ''}
                      accountName={transaction.accountName || ''}
                      fromAccountName={transaction.fromAccountName || ''}
                      toAccountName={transaction.toAccountName || ''}
                      onClick={() => onView(transaction.id)}
                      className={displayMode === 'compact' ? 'py-3' : 'py-4'}
                    />
                    
                    {/* Actions overlay - Desktop */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 hidden sm:flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(transaction.id);
                        }}
                        title={t.edit}
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <FiEdit2 size={16} className="text-gray-600 dark:text-gray-300" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(transaction.id);
                        }}
                        title={t.delete}
                        className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      >
                        <FiTrash2 size={16} className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(transaction.id);
                        }}
                        title={t.view}
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <FiMoreHorizontal size={16} className="text-gray-600 dark:text-gray-300" />
                      </Button>
                    </div>
                    
                    {/* Actions for mobile - Always visible */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:hidden flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(transaction.id);
                        }}
                        title={t.view}
                        className="h-8 w-8 p-0 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm"
                      >
                        <FiMoreHorizontal size={18} className="text-gray-700 dark:text-gray-300" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </motion.div>
      ))}
      
      {visibleCount < transactions.length && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          <div className="w-8 h-8 border-t-4 border-primary-500 rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
}; 