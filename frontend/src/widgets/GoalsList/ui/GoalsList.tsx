import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertCircle } from 'lucide-react';
import { Goal, useGoalsStore } from '@/store/goals-store';
import { GoalCard } from '@/entities/goal';
import { GoalForm } from '@/features/GoalForm';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Locale } from '@/shared/lib/i18n';

interface GoalsListProps {
  locale: Locale;
}

const goalsListTranslations = {
  en: {
    noGoals: 'You have no financial goals yet. Add your first goal to start tracking your progress!',
    addGoal: 'Add Goal',
    editGoal: 'Edit Goal',
    deleteGoal: 'Delete Goal',
    deleteConfirmation: 'Are you sure you want to delete this goal?',
    delete: 'Delete',
    deleting: 'Deleting...',
    cancel: 'Cancel',
    filterAll: 'All',
    filterOngoing: 'Ongoing',
    filterCompleted: 'Completed',
    filterPaused: 'Paused',
    sortLabel: 'Sort by',
    sortNewest: 'Newest',
    sortOldest: 'Oldest',
    sortAmount: 'Amount',
    sortProgress: 'Progress',
    loading: 'Loading goals...',
    retry: 'Retry',
    error: 'Error loading goals',
    deleteError: 'Error deleting goal'
  },
  ru: {
    noGoals: 'У вас пока нет финансовых целей. Добавьте свою первую цель, чтобы начать отслеживать прогресс!',
    addGoal: 'Добавить цель',
    editGoal: 'Изменить цель',
    deleteGoal: 'Удалить цель',
    deleteConfirmation: 'Вы уверены, что хотите удалить эту цель?',
    delete: 'Удалить',
    deleting: 'Удаление...',
    cancel: 'Отмена',
    filterAll: 'Все',
    filterOngoing: 'В процессе',
    filterCompleted: 'Завершенные',
    filterPaused: 'Приостановленные',
    sortLabel: 'Сортировать по',
    sortNewest: 'Новые',
    sortOldest: 'Старые',
    sortAmount: 'Сумме',
    sortProgress: 'Прогрессу',
    loading: 'Загрузка целей...',
    retry: 'Повторить',
    error: 'Ошибка загрузки целей',
    deleteError: 'Ошибка удаления цели'
  }
};

type SortOption = 'newest' | 'oldest' | 'amount' | 'progress';

export const GoalsList: FC<GoalsListProps> = ({ locale }) => {
  const t = goalsListTranslations[locale] || goalsListTranslations.en;
  const { goals, isLoading, error, deleteGoal, fetchGoals } = useGoalsStore();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeletingGoal, setIsDeletingGoal] = useState(false);
  
  const handleAddGoal = () => {
    setSelectedGoal(null);
    setIsFormModalOpen(true);
  };
  
  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsFormModalOpen(true);
  };
  
  const handleDeleteConfirm = (goal: Goal) => {
    setSelectedGoal(goal);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (selectedGoal) {
      try {
        setIsDeletingGoal(true);
        setDeleteError(null);
        await deleteGoal(selectedGoal.id);
        setIsDeleteModalOpen(false);
      } catch (error) {
        setDeleteError(error instanceof Error ? error.message : t.deleteError);
      } finally {
        setIsDeletingGoal(false);
      }
    }
  };
  
  const filteredGoals = goals.filter(goal => {
    if (!statusFilter) return true;
    return goal.status === statusFilter;
  });
  
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'amount':
        return b.target - a.target;
      case 'progress':
        const progressA = a.target > 0 ? a.saved / a.target : 0;
        const progressB = b.target > 0 ? b.saved / b.target : 0;
        return progressB - progressA;
      default:
        return 0;
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin"></div>
        <span className="sr-only">{t.loading}</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md flex flex-col items-center"
      >
        <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        <h3 className="text-lg font-semibold mb-2">{t.error}</h3>
        <p className="mb-4">{error}</p>
        <Button variant="primary" onClick={() => fetchGoals()}>
          {t.retry}
        </Button>
      </motion.div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === null ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            {t.filterAll}
          </Button>
          <Button
            variant={statusFilter === 'ongoing' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter('ongoing')}
          >
            {t.filterOngoing}
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter('completed')}
          >
            {t.filterCompleted}
          </Button>
          <Button
            variant={statusFilter === 'paused' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter('paused')}
          >
            {t.filterPaused}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium">{t.sortLabel}:</span>
          <select
            className="bg-background border border-border rounded-md text-sm p-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="newest">{t.sortNewest}</option>
            <option value="oldest">{t.sortOldest}</option>
            <option value="amount">{t.sortAmount}</option>
            <option value="progress">{t.sortProgress}</option>
          </select>
          
          <Button
            variant="primary"
            size="sm"
            className="ml-auto"
            onClick={handleAddGoal}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addGoal}
          </Button>
        </div>
      </div>
      
      {sortedGoals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-md p-6 text-center"
        >
          <p className="text-muted-foreground mb-4">{t.noGoals}</p>
          <Button variant="primary" onClick={handleAddGoal}>
            <Plus className="w-4 h-4 mr-2" />
            {t.addGoal}
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {sortedGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <GoalCard
                  goal={goal}
                  locale={locale}
                  onClick={() => handleEditGoal(goal)}
                  onEdit={() => handleEditGoal(goal)}
                  onDelete={() => handleDeleteConfirm(goal)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Goal Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedGoal ? t.editGoal : t.addGoal}
      >
        <GoalForm
          initialData={selectedGoal || undefined}
          onCancel={() => setIsFormModalOpen(false)}
          onSubmit={() => setIsFormModalOpen(false)}
          locale={locale}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t.deleteGoal}
      >
        <div className="p-4">
          {deleteError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md">
              {deleteError}
            </div>
          )}
          
          <p className="mb-4">{t.deleteConfirmation}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeletingGoal}>
              {t.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeletingGoal}>
              {isDeletingGoal ? t.deleting : t.delete}
              {isDeletingGoal && (
                <span className="ml-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 