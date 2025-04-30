import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { accountApi } from '@/entities/account/api/accountApi';
import { Button } from '@/shared/ui/Button';

interface AccountQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    name?: string;
    balance?: number;
    currency?: string;
    type?: 'cash' | 'bank' | 'credit';
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
    type: initialData?.type || 'cash',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData?.name || '',
        balance: initialData?.balance || 0,
        currency: initialData?.currency || 'USD',
        type: initialData?.type || 'cash',
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
        await accountApi.update(initialData.id, form);
      } else {
        await accountApi.create(form);
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
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
            required
          >
            <option value="cash">{t.cash}</option>
            <option value="bank">{t.bank}</option>
            <option value="credit">{t.credit}</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="secondary" onClick={onClose} type="button">
            {t.cancel}
          </Button>
          <Button type="submit" isLoading={loading} disabled={loading}>
            {t.save}
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm pt-2">{error}</div>}
      </form>
    </Modal>
  );
}; 