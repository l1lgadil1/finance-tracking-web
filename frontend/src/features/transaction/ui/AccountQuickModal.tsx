import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { accountApi } from '@/entities/account/api/accountApi';
import { Button } from '@/shared/ui/Button';
import { useTransactionModal } from '../model/useTransactionModal';
import { AccountTypeManagerModal } from './AccountTypeManagerModal';

interface AccountQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    name?: string;
    balance?: number;
    currency?: string;
    type?: 'cash' | 'bank' | 'credit';
    accountTypeId?: string;
  };
  locale: 'en' | 'ru';
  onSuccess?: () => void;
}

const translations = {
  en: {
    addTitle: 'Add Account',
    editTitle: 'Edit Account',
    name: 'Name',
    balance: 'Balance',
    currency: 'Currency',
    type: 'Type',
    save: 'Save',
    cancel: 'Cancel',
    cash: 'Cash',
    bank: 'Bank',
    credit: 'Credit',
  },
  ru: {
    addTitle: 'Добавить счет',
    editTitle: 'Редактировать счет',
    name: 'Название',
    balance: 'Баланс',
    currency: 'Валюта',
    type: 'Тип',
    save: 'Сохранить',
    cancel: 'Отмена',
    cash: 'Наличные',
    bank: 'Банк',
    credit: 'Кредит',
  },
};

export const AccountQuickModal: React.FC<AccountQuickModalProps> = ({
  isOpen,
  onClose,
  initialData,
  locale,
  onSuccess,
}) => {
  const t = translations[locale] || translations.en;
  const [form, setForm] = useState({
    name: initialData?.name || '',
    balance: initialData?.balance || 0,
    currency: initialData?.currency || 'USD',
    accountTypeId: initialData?.accountTypeId || '',
    type: initialData?.type || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTypeManagerOpen, setTypeManagerOpen] = useState(false);

  const {
    accountTypes,
    isAccountTypesLoading,
    isAccountTypesError,
    refetchAccountTypes,
  } = useTransactionModal();

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData?.name || '',
        balance: initialData?.balance || 0,
        currency: initialData?.currency || 'USD',
        accountTypeId: initialData?.accountTypeId || '',
        type: initialData?.type || '',
      });
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData?.id) {
        await accountApi.update(initialData.id, {
          name: form.name,
          balance: form.balance,
          currency: form.currency,
          accountTypeId: form.accountTypeId,
        });
      } else {
        await accountApi.create({
          name: form.name,
          balance: form.balance,
          currency: form.currency,
          accountTypeId: form.accountTypeId,
        });
      }
      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        setError((err as { message?: string }).message || 'Error');
      } else {
        setError('Error');
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={initialData?.id ? t.editTitle : t.addTitle}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">{t.name}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.balance}</label>
            <input
              name="balance"
              type="number"
              value={form.balance}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.currency}</label>
            <input
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.type}</label>
            <div className="flex gap-2 items-center">
              <select
                name="accountTypeId"
                value={form.accountTypeId || ''}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
                required
                disabled={isAccountTypesLoading || isAccountTypesError}
              >
                <option value="">{isAccountTypesLoading ? 'Loading...' : isAccountTypesError ? 'Error loading types' : 'Select type'}</option>
                {accountTypes && accountTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <Button variant="ghost" size="sm" onClick={() => setTypeManagerOpen(true)} aria-label="Manage Types">
                <span role="img" aria-label="settings">⚙️</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="secondary" onClick={onClose} type="button">
              {t.cancel}
            </Button>
            {initialData?.id && (
              <Button
                variant="secondary"
                type="button"
                className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this account?')) {
                    setLoading(true);
                    setError(null);
                    try {
                      await accountApi.delete(initialData.id!);
                      setLoading(false);
                      onSuccess?.();
                      onClose();
                    } catch {
                      setError('Error deleting account');
                      setLoading(false);
                    }
                  }
                }}
                disabled={loading}
              >
                Delete
              </Button>
            )}
            <Button type="submit" isLoading={loading} disabled={loading}>
              {t.save}
            </Button>
          </div>
          {error && <div className="text-red-500 text-sm pt-2">{error}</div>}
        </form>
      </Modal>
      <AccountTypeManagerModal
        isOpen={isTypeManagerOpen}
        onClose={() => setTypeManagerOpen(false)}
        onChanged={refetchAccountTypes}
      />
    </>
  );
}; 