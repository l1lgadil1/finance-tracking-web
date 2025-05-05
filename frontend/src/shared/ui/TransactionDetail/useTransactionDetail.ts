import { useMemo } from 'react';
import { TransactionType } from '@/shared/api/types';
import { Locale } from '@/shared/lib/i18n';

// Types
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Translations for the component
export const transactionDetailTranslations = {
  en: {
    description: 'Description',
    amount: 'Amount',
    date: 'Date',
    category: 'Category',
    type: 'Type',
    account: 'Account',
    fromAccount: 'From Account',
    toAccount: 'To Account',
    notes: 'Notes',
    noNotes: 'No notes provided',
    edit: 'Edit',
    delete: 'Delete',
    types: {
      income: 'Income',
      expense: 'Expense',
      transfer: 'Transfer',
      debt_give: 'Debt Given',
      debt_take: 'Debt Taken',
      debt_repay: 'Debt Repaid'
    }
  },
  ru: {
    description: 'Описание',
    amount: 'Сумма',
    date: 'Дата',
    category: 'Категория',
    type: 'Тип',
    account: 'Счет',
    fromAccount: 'Со счета',
    toAccount: 'На счет',
    notes: 'Заметки',
    noNotes: 'Заметки отсутствуют',
    edit: 'Изменить',
    delete: 'Удалить',
    types: {
      income: 'Доход',
      expense: 'Расход',
      transfer: 'Перевод',
      debt_give: 'Долг выдан',
      debt_take: 'Долг взят',
      debt_repay: 'Долг погашен'
    }
  }
};

interface UseTransactionDetailProps {
  type: TransactionType;
  amount: number;
  date: Date;
  category?: string;
  locale?: Locale;
}

export function useTransactionDetail({
  type,
  amount,
  date,
  category = '',
  locale = 'en'
}: UseTransactionDetailProps) {
  // Get translations based on locale
  const t = useMemo(() => 
    transactionDetailTranslations[locale] || transactionDetailTranslations.en, 
    [locale]
  );

  // Format amount to display format with currency symbol
  const formattedAmount = useMemo(() => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formattedAmount = absAmount.toFixed(2);
    return `${isNegative ? '-' : ''}$${formattedAmount}`;
  }, [amount]);

  // Get amount color class based on transaction type
  const amountColorClass = useMemo(() => {
    switch (type) {
      case 'income':
        return 'text-success';
      case 'expense':
        return 'text-error';
      case 'transfer':
        return 'text-primary-500';
      case 'debt_give':
        return 'text-warning';
      case 'debt_take':
        return 'text-info';
      case 'debt_repay':
        return 'text-warning';
      default:
        return 'text-foreground';
    }
  }, [type]);

  // Get badge variant based on category and type
  const categoryBadgeVariant = useMemo((): BadgeVariant => {
    if (type === 'income') return 'success';
    if (type === 'expense') return 'error';
    if (type === 'transfer') return 'primary';
    if (type === 'debt_give') return 'warning';
    if (type === 'debt_take') return 'info';
    if (type === 'debt_repay') return 'warning';
    
    // Fallback to default mapping
    const lowerCategory = category.toLowerCase();
    switch (lowerCategory) {
      case 'food':
      case 'groceries':
      case 'dining':
        return 'warning';
      case 'income':
      case 'salary':
      case 'bonus':
        return 'success';
      case 'housing':
      case 'rent':
      case 'mortgage':
        return 'error';
      case 'transfer':
        return 'primary';
      case 'debt':
      case 'loan':
        return 'warning';
      default:
        return 'secondary';
    }
  }, [type, category]);

  // Format date to localized string
  const formattedDate = useMemo(() => {
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [date, locale]);

  // Get transaction type label
  const transactionTypeLabel = useMemo(() => {
    return t.types[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }, [t, type]);

  // Get background color for the transaction icon
  const transactionIconBg = useMemo(() => {
    switch (type) {
      case 'income':
        return 'bg-success/15';
      case 'expense':
        return 'bg-error/15';
      case 'transfer':
        return 'bg-primary-100/50 dark:bg-primary-900/50';
      case 'debt_give':
      case 'debt_take':
      case 'debt_repay':
        return 'bg-warning/15';
      default:
        return 'bg-muted';
    }
  }, [type]);

  // Get border top color for the card
  const borderTopColor = useMemo(() => {
    switch (type) {
      case 'income':
        return 'var(--color-success)';
      case 'expense':
        return 'var(--color-error)';
      case 'transfer':
        return 'var(--color-primary)';
      default:
        return 'var(--color-warning)';
    }
  }, [type]);

  // Animation variants
  const animations = {
    cardVariants: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.3,
          staggerChildren: 0.1
        }
      }
    },
    itemVariants: {
      hidden: { opacity: 0, x: -20 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.3 }
      }
    },
    buttonVariants: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 500, 
          damping: 25 
        }
      }
    }
  };

  return {
    t,
    formattedAmount,
    amountColorClass,
    categoryBadgeVariant,
    formattedDate,
    transactionTypeLabel,
    transactionIconBg,
    borderTopColor,
    animations
  };
} 