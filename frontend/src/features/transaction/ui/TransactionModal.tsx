import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/Button';
import { IoMdClose } from 'react-icons/io';
import { useTransactionModal } from '../model/useTransactionModal';
import { Account } from '@/entities/account/api/accountApi';
import { Category } from '@/entities/category/api/categoryApi';
import { TransactionType } from '@/shared/constants/finance';
import { AccountQuickModal } from './AccountQuickModal';
import { CategoryQuickModal } from './CategoryQuickModal';
import { FiPlus, FiEdit2 } from 'react-icons/fi';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description?: string;
  categoryId?: string;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  date: Date;
  profileId: string;
  contactName?: string;
  contactPhone?: string;
}

// Define translations
const translations = {
  en: {
    newTransaction: 'New Transaction',
    amount: 'Amount',
    description: 'Description',
    descriptionPlaceholder: 'Enter transaction description',
    account: 'Account',
    selectAccount: 'Select an account',
    category: 'Category',
    selectCategory: 'Select a category',
    date: 'Date',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    types: {
      income: 'Income',
      expense: 'Expense',
      transfer: 'Transfer',
      debtGive: 'Gave Debt',
      debtTake: 'Took Debt',
      debtRepay: 'Repay Debt'
    }
  },
  ru: {
    newTransaction: 'Новая транзакция',
    amount: 'Сумма',
    description: 'Описание',
    descriptionPlaceholder: 'Введите описание транзакции',
    account: 'Счет',
    selectAccount: 'Выберите счет',
    category: 'Категория',
    selectCategory: 'Выберите категорию',
    date: 'Дата',
    save: 'Сохранить',
    cancel: 'Отмена',
    close: 'Закрыть',
    types: {
      income: 'Доход',
      expense: 'Расход',
      transfer: 'Перевод',
      debtGive: 'Дал в долг',
      debtTake: 'Взял в долг',
      debtRepay: 'Погасить долг'
    }
  }
};

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  locale
}) => {
  const t = translations[locale] || translations.en;
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [formData, setFormData] = useState<Partial<TransactionFormData>>({
    type: TransactionType.EXPENSE,
    date: new Date(),
  });
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const {
    accounts,
    isAccountsLoading,
    isAccountsError,
    refetchAccounts,
    categories,
    isCategoriesLoading,
    isCategoriesError,
    refetchCategories,
    submitTransaction,
    isSubmitting,
    isSubmitError,
    isSubmitSuccess,
    submitError,
    resetSubmit,
    profileId,
    isProfilesLoading,
  } = useTransactionModal();

  React.useEffect(() => {
    if (isSubmitSuccess) {
      onClose();
      resetSubmit();
    }
  }, [isSubmitSuccess, onClose, resetSubmit]);

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Only render form if profileId is available
  if (isProfilesLoading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 text-center">
              <span className="text-lg text-gray-700 dark:text-gray-200">Loading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  if (!profileId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.type && formData.accountId && formData.categoryId) {
      const {
        amount,
        date,
        description,
        accountId,
        categoryId,
      } = formData;
      submitTransaction({
        amount,
        date: (date instanceof Date ? date.toISOString() : date) || new Date().toISOString(),
        description: description ?? '',
        accountId: accountId ?? '',
        categoryId: categoryId ?? '',
        profileId,
        type: transactionType,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const transactionTypes = [
    { value: TransactionType.INCOME, label: t.types.income, key: 'income' },
    { value: TransactionType.EXPENSE, label: t.types.expense, key: 'expense' },
    { value: TransactionType.TRANSFER, label: t.types.transfer, key: 'transfer' },
    { value: TransactionType.DEBT, label: t.types.debtGive, key: 'debt_give' },
    { value: TransactionType.DEBT, label: t.types.debtTake, key: 'debt_take' },
    { value: TransactionType.DEBT_REPAY, label: t.types.debtRepay, key: 'debt_repay' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Quick Add/Edit Modals */}
          <AccountQuickModal
            isOpen={isAccountModalOpen}
            onClose={() => { setAccountModalOpen(false); setEditAccount(null); }}
            initialData={editAccount || undefined}
            locale={locale}
            onSuccess={refetchAccounts}
          />
          <CategoryQuickModal
            isOpen={isCategoryModalOpen}
            onClose={() => { setCategoryModalOpen(false); setEditCategory(null); }}
            initialData={editCategory || undefined}
            locale={locale}
            profileId={profileId}
            onSuccess={refetchCategories}
          />
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-4 top-[10%] md:inset-auto md:top-[15%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t.newTransaction}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                leftIcon={<IoMdClose className="w-5 h-5" />}
                aria-label={t.close}
              >
                <span className="sr-only">{t.close}</span>
              </Button>
            </div>
            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Transaction Type */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {transactionTypes.map((type) => (
                  <Button
                    key={type.key}
                    variant={transactionType === type.value ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      setTransactionType(type.value as TransactionType);
                      setFormData(prev => ({ ...prev, type: type.value as TransactionType }));
                    }}
                    className="w-full"
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.amount}
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.description}
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                  placeholder={t.descriptionPlaceholder}
                />
              </div>
              {/* Account Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  {t.account}
                  <button type="button" onClick={() => setAccountModalOpen(true)} className="ml-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Add Account">
                    <FiPlus className="w-4 h-4" />
                  </button>
                  {formData.accountId && accounts && (
                    <button
                      type="button"
                      onClick={() => {
                        const acc = (accounts as Account[]).find(a => a.id === formData.accountId);
                        if (acc) { setEditAccount(acc); setAccountModalOpen(true); }
                      }}
                      className="ml-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label="Edit Account"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  )}
                </label>
                <select
                  name="accountId"
                  value={formData.accountId || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                  required
                  disabled={isAccountsLoading || isAccountsError}
                >
                  <option value="">{isAccountsLoading ? 'Loading...' : isAccountsError ? 'Error loading accounts' : t.selectAccount}</option>
                  {accounts && (accounts as Account[]).map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.balance} {acc.currency})
                    </option>
                  ))}
                </select>
              </div>
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  {t.category}
                  <button type="button" onClick={() => setCategoryModalOpen(true)} className="ml-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Add Category">
                    <FiPlus className="w-4 h-4" />
                  </button>
                  {formData.categoryId && categories && (
                    <button
                      type="button"
                      onClick={() => {
                        const cat = (categories as Category[]).find(c => c.id === formData.categoryId);
                        if (cat) { setEditCategory(cat); setCategoryModalOpen(true); }
                      }}
                      className="ml-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label="Edit Category"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  )}
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                  required
                  disabled={isCategoriesLoading || isCategoriesError}
                >
                  <option value="">{isCategoriesLoading ? 'Loading...' : isCategoriesError ? 'Error loading categories' : t.selectCategory}</option>
                  {categories && (categories as Category[]).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.date}
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                  required
                />
              </div>
              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="secondary" onClick={onClose} type="button">
                  {t.cancel}
                </Button>
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                  {t.save}
                </Button>
              </div>
              {isSubmitError && (
                <div className="text-red-500 text-sm pt-2">
                  {submitError && typeof submitError === 'object' && 'message' in submitError ? (submitError as Error).message : 'Error submitting transaction'}
                </div>
              )}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 