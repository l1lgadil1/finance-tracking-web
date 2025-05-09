import React, { useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useGoalModal } from '../model/useGoalModal';
import { Locale } from '@/shared/lib/i18n';
import { useForm } from 'react-hook-form';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  onSuccess?: () => void;
}

// Form values interface
interface GoalFormValues {
  title: string;
  target: number;
  current: number;
  deadline: string;
}

// Define translations
const translations = {
  en: {
    addGoal: 'Add Goal',
    title: 'Goal Name',
    titlePlaceholder: 'Enter goal name',
    target: 'Target Amount',
    current: 'Current Amount',
    deadline: 'Target Date',
    save: 'Save Goal',
    cancel: 'Cancel',
    titleRequired: 'Goal name is required',
    targetRequired: 'Target amount is required',
    targetPositive: 'Target amount must be positive',
    currentPositive: 'Current amount must be non-negative',
    deadlineRequired: 'Target date is required',
    invalidDate: 'Invalid date format',
    pastDate: 'Target date cannot be in the past',
  },
  ru: {
    addGoal: 'Добавить цель',
    title: 'Название цели',
    titlePlaceholder: 'Введите название цели',
    target: 'Целевая сумма',
    current: 'Текущая сумма',
    deadline: 'Целевая дата',
    save: 'Сохранить цель',
    cancel: 'Отмена',
    titleRequired: 'Название цели обязательно',
    targetRequired: 'Целевая сумма обязательна',
    targetPositive: 'Целевая сумма должна быть положительной',
    currentPositive: 'Текущая сумма должна быть неотрицательной',
    deadlineRequired: 'Целевая дата обязательна',
    invalidDate: 'Неверный формат даты',
    pastDate: 'Целевая дата не может быть в прошлом',
  }
};

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  locale,
  onSuccess
}) => {
  const t = translations[locale] || translations.en;
  const { createGoal, isSubmitting, isSubmitError, isSubmitSuccess, submitError, resetSubmit } = useGoalModal();

  // Set up form
  const { register, handleSubmit, formState: { errors }, reset } = useForm<GoalFormValues>({
    defaultValues: {
      title: '',
      target: undefined,
      current: 0,
      deadline: '',
    }
  });

  // Clear form on close and success
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (isSubmitSuccess) {
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      resetSubmit();
      reset();
    }
  }, [isSubmitSuccess, onClose, resetSubmit, reset, onSuccess]);

  // Format today's date as YYYY-MM-DD for the date input min value
  const today = new Date().toISOString().split('T')[0];

  // Handle form submission
  const onSubmit = (data: GoalFormValues) => {
    // Convert string values to numbers
    const goalData = {
      title: data.title,
      target: parseFloat(data.target.toString()),
      current: parseFloat(data.current.toString()),
      deadline: data.deadline,
    };

    createGoal(goalData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.addGoal}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Goal Name */}
        <Input
          label={t.title}
          placeholder={t.titlePlaceholder}
          fullWidth
          error={errors.title?.message}
          {...register('title', { 
            required: t.titleRequired,
            maxLength: { value: 100, message: 'Name too long' }
          })}
        />

        {/* Target Amount */}
        <Input
          label={t.target}
          type="number"
          // step="0.01"
          fullWidth
          error={errors.target?.message}
          {...register('target', { 
            required: t.targetRequired,
            validate: value => parseFloat(value.toString()) > 0 || t.targetPositive,
          })}
        />

        {/* Current Amount */}
        <Input
          label={t.current}
          type="number"
          // step="0.01"
          fullWidth
          error={errors.current?.message}
          {...register('current', { 
            validate: value => parseFloat(value.toString()) >= 0 || t.currentPositive,
          })}
        />

        {/* Deadline */}
        <Input
          label={t.deadline}
          type="date"
          fullWidth
          min={today}
          error={errors.deadline?.message}
          {...register('deadline', { 
            required: t.deadlineRequired,
            validate: {
              validDate: value => !isNaN(Date.parse(value)) || t.invalidDate,
              futureDate: value => new Date(value) > new Date() || t.pastDate,
            }
          })}
        />

        {/* Error message */}
        {isSubmitError && (
          <div className="p-2 bg-red-50 text-red-600 rounded-md text-sm">
            {submitError || 'Something went wrong.'}
          </div>
        )}

        {/* Form actions */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {t.save}
          </Button>
        </div>
      </form>
    </Modal>
  );
}; 