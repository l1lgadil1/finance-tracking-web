import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/Button';
import { IoMdClose } from 'react-icons/io';
import { useTransactionModal } from '../model/useTransactionModal';
import { Account } from '@/entities/account/api/accountApi';
import { Category } from '@/entities/category/api/categoryApi';
import { Transaction } from '@/shared/api/types';
import { TransactionType } from '@/shared/constants/finance';
import { AccountQuickModal } from './AccountQuickModal';
import { CategoryQuickModal } from './CategoryQuickModal';
import { FiPlus, FiEdit2 } from 'react-icons/fi';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  defaultTransactionType?: TransactionType;
  transactionToEdit?: Transaction | null;
  onSuccess?: () => void;
  selectedFromAccountId?: string | null;
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
  relatedDebtId?: string;
}

// Define translations
const translations = {
  en: {
    newTransaction: 'New Transaction',
    editTransaction: 'Edit Transaction',
    amount: 'Amount',
    description: 'Description',
    descriptionPlaceholder: 'Enter transaction description',
    account: 'Account',
    selectAccount: 'Select an account',
    fromAccount: 'From Account',
    toAccount: 'To Account',
    category: 'Category',
    selectCategory: 'Select a category',
    date: 'Date',
    save: 'Save',
    update: 'Update',
    cancel: 'Cancel',
    close: 'Close',
    contactName: 'Contact Name',
    contactNamePlaceholder: 'Enter contact name',
    contactPhone: 'Contact Phone',
    contactPhonePlaceholder: 'Enter contact phone',
    debtToRepay: 'Debt to Repay',
    selectDebt: 'Select debt to repay',
    noActiveDebts: 'No active debts found. Create a debt transaction first.',
    givenTo: 'Given to:',
    takenFrom: 'Taken from:',
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
    editTransaction: 'Редактировать транзакцию',
    amount: 'Сумма',
    description: 'Описание',
    descriptionPlaceholder: 'Введите описание транзакции',
    account: 'Счет',
    selectAccount: 'Выберите счет',
    fromAccount: 'Счет списания',
    toAccount: 'Счет зачисления',
    category: 'Категория',
    selectCategory: 'Выберите категорию',
    date: 'Date',
    save: 'Сохранить',
    update: 'Обновить',
    cancel: 'Отмена',
    close: 'Закрыть',
    contactName: 'Имя контакта',
    contactNamePlaceholder: 'Введите имя контакта',
    contactPhone: 'Телефон контакта',
    contactPhonePlaceholder: 'Введите телефон контакта',
    debtToRepay: 'Долг для погашения',
    selectDebt: 'Выберите долг для погашения',
    noActiveDebts: 'Нет активных долгов. Сначала создайте долговую транзакцию.',
    givenTo: 'Дано:',
    takenFrom: 'Взято у:',
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
  locale,
  defaultTransactionType=TransactionType.EXPENSE,
  transactionToEdit,
  onSuccess,
  selectedFromAccountId
}) => {
  const t = translations[locale] || translations.en;
  const [transactionType, setTransactionType] = useState<TransactionType>(defaultTransactionType);
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
    updateTransaction,
    isSubmitting,
    isSubmitError,
    isSubmitSuccess,
    submitError,
    resetSubmit,
    profileId,
    isProfilesLoading,
    categoryTypes,
    activeDebts,
    isActiveDebtsLoading,
    isActiveDebtsError,
    activeDebtsError,
    refetchActiveDebts,
  } = useTransactionModal();

  // Load transaction data when editing
  useEffect(() => {
    if (transactionToEdit) {
      // Set the transaction type
      setTransactionType(transactionToEdit.type as TransactionType);
      
      // Set the form data using a type cast to avoid complex type issues
      const transaction = transactionToEdit as unknown as {
        type?: TransactionType;
        amount?: number;
        description?: string;
        categoryId?: string;
        accountId?: string;
        fromAccountId?: string;
        toAccountId?: string;
        date?: string | Date;
        profileId?: string;
        contactName?: string;
        contactPhone?: string;
        relatedDebtId?: string;
      };
      
      setFormData({
        type: transaction.type || TransactionType.EXPENSE,
        amount: transaction.amount,
        description: transaction.description || '',
        categoryId: transaction.categoryId,
        accountId: transaction.accountId,
        fromAccountId: transaction.fromAccountId,
        toAccountId: transaction.toAccountId,
        date: transaction.date ? new Date(transaction.date) : new Date(),
        profileId: transaction.profileId || profileId || '',
        contactName: transaction.contactName,
        contactPhone: transaction.contactPhone,
        relatedDebtId: transaction.relatedDebtId,
      });
    } else {
      // Reset form when not editing
      setTransactionType(defaultTransactionType);
      setFormData({
        type: defaultTransactionType,
        date: new Date(),
      });
    }
  }, [transactionToEdit, profileId, defaultTransactionType]);

  // Add effect to set fromAccountId when opening for transfer
  useEffect(() => {
    if (isOpen && selectedFromAccountId && defaultTransactionType === TransactionType.TRANSFER) {
      setFormData(prev => ({
        ...prev,
        fromAccountId: selectedFromAccountId,
        type: TransactionType.TRANSFER
      }));
    }
  }, [isOpen, selectedFromAccountId, defaultTransactionType]);

  // Helper function to get category type name based on transaction type
  const getCategoryTypeForTransaction = (transactionType: TransactionType) => {
    switch (transactionType) {
      case TransactionType.INCOME:
        return 'Income';
      case TransactionType.EXPENSE:
        return 'Expense';
      case TransactionType.TRANSFER:
        return 'Transfer';
      case TransactionType.DEBT_GIVE:
        return 'Gave Debt';
      case TransactionType.DEBT_TAKE:
        return 'Took Debt';
      case TransactionType.DEBT_REPAY:
        return 'Repay Debt';
      default:
        return 'Expense'; // Default to expense
    }
  };

  // Filter categories based on transaction type
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    
    // Get the category type name that corresponds to the selected transaction type
    const targetCategoryTypeName = getCategoryTypeForTransaction(transactionType);
    
    // Filter categories by their categoryTypeNameSnapshot
    return (categories as Category[]).filter(category => {
      return category.categoryTypeNameSnapshot === targetCategoryTypeName;
    });
  }, [categories, transactionType]);

  // Log the filtered categories for debugging
  useEffect(() => {
    if (filteredCategories) {
      console.log('Filtered categories for transaction type:', transactionType, filteredCategories);
    }
  }, [filteredCategories, transactionType]);

  // Fetch active debts when the DEBT_REPAY type is selected with improved debugging
  useEffect(() => {
    if (transactionType === TransactionType.DEBT_REPAY) {
      console.log('DEBT_REPAY selected, fetching active debts...');
      refetchActiveDebts()
        .then(result => {
          console.log('Active debts fetch result:', result);
        })
        .catch(error => {
          console.error('Active debts fetch error:', error);
        });
    }
  }, [transactionType, refetchActiveDebts]);

  // Log active debts state changes for debugging
  useEffect(() => {
    console.log('Active debts state:', { 
      activeDebts, 
      isLoading: isActiveDebtsLoading, 
      isError: isActiveDebtsError,
      error: activeDebtsError
    });
  }, [activeDebts, isActiveDebtsLoading, isActiveDebtsError, activeDebtsError]);

  // When a debt is selected, prefill the amount from the original debt
  useEffect(() => {
    if (
      transactionType === TransactionType.DEBT_REPAY && 
      formData.relatedDebtId && 
      activeDebts?.length
    ) {
      const selectedDebt = activeDebts.find(debt => debt.id === formData.relatedDebtId);
      if (selectedDebt) {
        // Prefill amount with the debt amount
        setFormData(prev => ({
          ...prev,
          amount: selectedDebt.amount,
          contactName: selectedDebt.contactName,
          contactPhone: selectedDebt.contactPhone,
          description: `Repayment of debt ${selectedDebt.type === 'debt_give' ? 'given to' : 'taken from'} ${selectedDebt.contactName}`,
        }));
      }
    }
  }, [transactionType, formData.relatedDebtId, activeDebts]);

  useEffect(() => {
    if (isSubmitSuccess) {
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      resetSubmit();
    }
  }, [isSubmitSuccess, onClose, resetSubmit, onSuccess]);

  useEffect(() => {
    if(defaultTransactionType) {
      setTransactionType(defaultTransactionType);
    }
  }, [defaultTransactionType]);

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
    
    // Validate common required fields
    if (!formData.amount || !formData.type) {
      return;
    }
    
    // Create transaction data object
    const data: Record<string, unknown> = {
      amount: formData.amount,
      date: (formData.date instanceof Date ? formData.date.toISOString() : formData.date) || new Date().toISOString(),
      description: formData.description ?? '',
      profileId,
      type: transactionType,
    };
    
    // Handle different transaction types
    if (transactionType === TransactionType.TRANSFER) {
      // Transfer requires fromAccountId and toAccountId
      if (!formData.fromAccountId || !formData.toAccountId) {
        return;
      }
      data.fromAccountId = formData.fromAccountId;
      data.toAccountId = formData.toAccountId;
      // For transfers, set accountId to null since we use fromAccountId
      data.accountId = null;
      data.categoryId = null;
    } else {
      // All non-transfer transactions require accountId
      if (!formData.accountId) {
        return;
      }
      data.accountId = formData.accountId;
      
      // Add category for income and expense only
      if ([TransactionType.INCOME, TransactionType.EXPENSE].includes(transactionType)) {
        if (!formData.categoryId) {
          return; // Need category for income/expense
        }
        data.categoryId = formData.categoryId;
      } else {
        // Set categoryId to null for debt transactions
        data.categoryId = null;
      }
      
      // Debt transactions need contact info
      if ([TransactionType.DEBT_GIVE, TransactionType.DEBT_TAKE].includes(transactionType)) {
        if (!formData.contactName || !formData.contactPhone) {
          return;
        }
        data.contactName = formData.contactName;
        data.contactPhone = formData.contactPhone;
      }
      
      // For debt repayment, a related debt transaction must be selected
      if (transactionType === TransactionType.DEBT_REPAY) {
        if (!formData.relatedDebtId) {
          return;
        }
        data.relatedDebtId = formData.relatedDebtId;
        
        // Find the original debt to get contact information
        const relatedDebt = activeDebts?.find(debt => debt.id === formData.relatedDebtId);
        if (relatedDebt) {
          data.contactName = relatedDebt.contactName;
          data.contactPhone = relatedDebt.contactPhone;
        }
      }
    }
    
    // Submit transaction with the properly formed data
    if (transactionToEdit) {
      // Update existing transaction
      updateTransaction(transactionToEdit.id, data);
    } else {
      // Create new transaction
      // Type assertion with the expected type from the API
      type TransactionInput = Omit<Transaction, "id" | "category" | "createdAt">;
      submitTransaction(data as unknown as TransactionInput);
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
    { value: TransactionType.DEBT_GIVE, label: t.types.debtGive, key: 'debt_give' },
    { value: TransactionType.DEBT_TAKE, label: t.types.debtTake, key: 'debt_take' },
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
          {/* Centered Modal Wrapper */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mx-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {transactionToEdit ? t.editTransaction : t.newTransaction}
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
                
                {/* Account Selection - shown for INCOME, EXPENSE, DEBT_GIVE, DEBT_TAKE, DEBT_REPAY */}
                {[TransactionType.INCOME, TransactionType.EXPENSE, TransactionType.DEBT_GIVE, 
                  TransactionType.DEBT_TAKE, TransactionType.DEBT_REPAY].includes(transactionType) && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.account}
                      </label>
                      <button type="button" onClick={() => setAccountModalOpen(true)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Add Account">
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
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
                      {formData.accountId && accounts && (
                        <button
                          type="button"
                          onClick={() => {
                            const acc = (accounts as Account[]).find(a => a.id === formData.accountId);
                            if (acc) { setEditAccount(acc); setAccountModalOpen(true); }
                          }}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Edit Account"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* From/To Account Selection - only shown for TRANSFER */}
                {transactionType === TransactionType.TRANSFER && (
                  <>
                    {/* From Account */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.fromAccount || 'From Account'}
                        </label>
                        <button type="button" onClick={() => setAccountModalOpen(true)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Add Account">
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <select
                        name="fromAccountId"
                        value={formData.fromAccountId || ''}
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
                    
                    {/* To Account */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t.toAccount || 'To Account'}
                        </label>
                      </div>
                      <select
                        name="toAccountId"
                        value={formData.toAccountId || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                        required
                        disabled={isAccountsLoading || isAccountsError}
                      >
                        <option value="">{isAccountsLoading ? 'Loading...' : isAccountsError ? 'Error loading accounts' : t.selectAccount}</option>
                        {accounts && (accounts as Account[]).map((acc) => (
                          <option key={acc.id} value={acc.id} disabled={acc.id === formData.fromAccountId}>
                            {acc.name} ({acc.balance} {acc.currency})
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                
                {/* Contact Info - only shown for DEBT_GIVE and DEBT_TAKE */}
                {[TransactionType.DEBT_GIVE, TransactionType.DEBT_TAKE].includes(transactionType) && (
                  <>
                    {/* Contact Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.contactName || 'Contact Name'}
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                        placeholder={t.contactNamePlaceholder || 'Enter contact name'}
                        required
                      />
                    </div>
                    
                    {/* Contact Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.contactPhone || 'Contact Phone'}
                      </label>
                      <input
                        type="text"
                        name="contactPhone"
                        value={formData.contactPhone || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                        placeholder={t.contactPhonePlaceholder || 'Enter contact phone'}
                        required
                      />
                    </div>
                  </>
                )}
                
                {/* Category Selection - only shown for INCOME and EXPENSE */}
                {[TransactionType.INCOME, TransactionType.EXPENSE].includes(transactionType) && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.category}
                      </label>
                      <button 
                        type="button" 
                        onClick={() => {
                          // Pre-select category type based on current transaction type
                          const categoryTypeName = getCategoryTypeForTransaction(transactionType);
                          // Find matching category type ID from available category types
                          const categoryTypeObj = categoryTypes?.find((ct: { name: string; id: string }) => ct.name === categoryTypeName);
                          setCategoryModalOpen(true);
                          // Reset any previous edit category with appropriate type preselected
                          setEditCategory({
                            id: '',
                            name: '',
                            profileId,
                            categoryTypeId: categoryTypeObj?.id || '',
                            categoryTypeNameSnapshot: categoryTypeName,
                          } as Category);
                        }} 
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
                        aria-label="Add Category"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        name="categoryId"
                        value={formData.categoryId || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                        required
                        disabled={isCategoriesLoading || isCategoriesError}
                      >
                        <option value="">{isCategoriesLoading ? 'Loading...' : isCategoriesError ? 'Error loading categories' : t.selectCategory}</option>
                        {filteredCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {formData.categoryId && categories && (
                        <button
                          type="button"
                          onClick={() => {
                            const cat = (categories as Category[]).find(c => c.id === formData.categoryId);
                            if (cat) { setEditCategory(cat); setCategoryModalOpen(true); }
                          }}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Edit Category"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Active Debts Selection - only shown for DEBT_REPAY */}
                {transactionType === TransactionType.DEBT_REPAY && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.debtToRepay}
                      </label>
                    </div>
                    <select
                      name="relatedDebtId"
                      value={formData.relatedDebtId || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white"
                      required
                      disabled={isActiveDebtsLoading || isActiveDebtsError}
                    >
                      <option value="">{isActiveDebtsLoading ? 'Loading...' : isActiveDebtsError ? 'Error loading debts' : t.selectDebt}</option>
                      {activeDebts && activeDebts.map((debt) => (
                        <option key={debt.id} value={debt.id}>
                          {debt.type === 'debt_give' ? t.givenTo : t.takenFrom}
                          {debt.contactName} - {debt.amount} ({new Date(debt.date).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                    {isActiveDebtsError && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Error loading debts: {activeDebtsError ? String(activeDebtsError).substring(0, 100) : 'Unknown error'}
                      </p>
                    )}
                    {activeDebts && activeDebts.length === 0 && !isActiveDebtsError && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        {t.noActiveDebts}
                      </p>
                    )}
                  </div>
                )}
                
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
                    {transactionToEdit ? t.update : t.save}
                  </Button>
                </div>
                {isSubmitError && (
                  <div className="text-red-500 text-sm pt-2">
                    {submitError && typeof submitError === 'object' && 'message' in submitError ? (submitError as Error).message : 'Error submitting transaction'}
                  </div>
                )}
              </form>
              {/* Quick Add/Edit Modals INSIDE modal wrapper for proper stacking */}
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}; 