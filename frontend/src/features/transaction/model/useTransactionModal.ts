import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { accountApi } from '@/entities/account/api/accountApi';
import { categoryApi } from '@/entities/category/api/categoryApi';
import { transactionApi } from '@/entities/transaction/api/transactionApi';
import { userApi } from '@/entities/user/api/userApi';

export function useTransactionModal() {
  const queryClient = useQueryClient();

  // Fetch accounts
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    refetch: refetchAccounts,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountApi.getAll,
  });

  // Fetch categories
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  // Fetch user profiles (to get profileId)
  const {
    data: profiles,
    isLoading: isProfilesLoading,
    isError: isProfilesError,
    refetch: refetchProfiles,
  } = useQuery({
    queryKey: ['profiles'],
    queryFn: userApi.getProfiles,
  });

  // Get the first profileId (or undefined)
  const profileId = profiles && profiles.length > 0 ? profiles[0].id : undefined;

  // Transaction submit mutation
  const mutation = useMutation({
    mutationFn: transactionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  // State for quick add/edit modals (to be implemented)
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  return {
    accounts,
    isAccountsLoading,
    isAccountsError,
    refetchAccounts,
    categories,
    isCategoriesLoading,
    isCategoriesError,
    refetchCategories,
    submitTransaction: mutation.mutate,
    isSubmitting: mutation.status === 'pending',
    isSubmitError: mutation.status === 'error',
    isSubmitSuccess: mutation.status === 'success',
    submitError: mutation.error,
    resetSubmit: mutation.reset,
    isAccountModalOpen,
    setAccountModalOpen,
    isCategoryModalOpen,
    setCategoryModalOpen,
    profiles,
    isProfilesLoading,
    isProfilesError,
    refetchProfiles,
    profileId,
  };
} 