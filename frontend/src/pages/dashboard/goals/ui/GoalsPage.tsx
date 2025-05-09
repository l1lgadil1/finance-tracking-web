'use client'
import { FC, useEffect } from 'react';
import { GoalsList } from '@/widgets/GoalsList';
import { useGoalsStore } from '@/store/goals-store';
import { Locale } from '@/shared/lib/i18n';

interface GoalsPageProps {
  locale: Locale;
}

const goalsPageTranslations = {
  en: {
    title: 'Financial Goals'
  },
  ru: {
    title: 'Финансовые цели'
  }
};

export const GoalsPage: FC<GoalsPageProps> = ({ locale }) => {
  const t = goalsPageTranslations[locale] || goalsPageTranslations.en;
  const { fetchGoals } = useGoalsStore();
  
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      <GoalsList locale={locale} />
    </div>
  );
}; 