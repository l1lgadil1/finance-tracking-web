import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { goalApi } from '@/entities/goal/api/goalApi';

export function useGoalModal() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Goal creation mutation
  const createGoalMutation = useMutation({
    mutationFn: goalApi.create,
    onMutate: () => {
      setIsSubmitting(true);
      setSubmitError(null);
      setIsSubmitSuccess(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsSubmitSuccess(true);
    },
    onError: (error: unknown) => {
      console.error('Error creating goal:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create goal');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const resetSubmit = () => {
    setIsSubmitting(false);
    setSubmitError(null);
    setIsSubmitSuccess(false);
  };

  return {
    createGoal: createGoalMutation.mutate,
    isSubmitting,
    isSubmitError: !!submitError,
    isSubmitSuccess,
    submitError,
    resetSubmit,
  };
} 