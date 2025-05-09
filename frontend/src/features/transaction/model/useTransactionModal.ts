import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { accountApi } from '@/entities/account/api/accountApi';
import { categoryApi } from '@/entities/category/api/categoryApi';
import { transactionApi } from '@/entities/transaction/api/transactionApi';
import { userApi } from '@/entities/user/api/userApi';
import { accountTypeApi } from '@/entities/account/api/accountTypeApi';
import { categoryTypeApi, CategoryType } from '@/entities/category/api/categoryTypeApi';

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

  // Fetch account types
  const {
    data: accountTypes,
    isLoading: isAccountTypesLoading,
    isError: isAccountTypesError,
    refetch: refetchAccountTypes,
  } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: accountTypeApi.getAll,
  });

  // Fetch category types - simplified to work with global types
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [isCategoryTypesLoading, setIsCategoryTypesLoading] = useState(false);
  const [isCategoryTypesError, setIsCategoryTypesError] = useState(false);

  const fetchCategoryTypes = useCallback(async () => {
    setIsCategoryTypesLoading(true);
    setIsCategoryTypesError(false);
    try {
      console.log('Fetching global category types...');
      const response = await categoryTypeApi.getAll();
      console.log('Category types response:', response);
      
      if (Array.isArray(response) && response.length > 0) {
        setCategoryTypes(response);
      } else {
        console.warn('Received empty or invalid category types array:', response);
        setCategoryTypes([]);
        setIsCategoryTypesError(true);
      }
    } catch (error) {
      console.error('Error fetching category types:', error);
      setCategoryTypes([]);
      setIsCategoryTypesError(true);
    } finally {
      setIsCategoryTypesLoading(false);
    }
  }, []);

  const refetchCategoryTypes = useCallback(() => {
    fetchCategoryTypes();
  }, [fetchCategoryTypes]);

  useEffect(() => {
    fetchCategoryTypes();
  }, [fetchCategoryTypes]);

  // Transaction submit mutation
  const createMutation = useMutation({
    mutationFn: transactionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Transaction update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: string, transaction: Record<string, unknown> }) => 
      transactionApi.update(data.id, data.transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // State for quick add/edit modals (to be implemented)
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  // Function to handle transaction updating
  const handleUpdateTransaction = (id: string, data: Record<string, unknown>) => {
    return updateMutation.mutate({ id, transaction: data });
  };

  // Function to determine if we're submitting (either creating or updating)
  const isSubmitting = createMutation.status === 'pending' || updateMutation.status === 'pending';
  
  // Function to determine if there was an error (either in creating or updating)
  const isSubmitError = createMutation.status === 'error' || updateMutation.status === 'error';
  
  // Function to determine if the submission was successful (either creating or updating)
  const isSubmitSuccess = createMutation.status === 'success' || updateMutation.status === 'success';
  
  // Get the error, prioritizing the most recent operation
  const submitError = updateMutation.error || createMutation.error;
  
  // Reset both mutations
  const resetSubmit = () => {
    createMutation.reset();
    updateMutation.reset();
  };

  // Fetch active debts
  const {
    data: activeDebts,
    isLoading: isActiveDebtsLoading,
    isError: isActiveDebtsError,
    error: activeDebtsError,
    refetch: refetchActiveDebts,
  } = useQuery({
    queryKey: ['active-debts'],
    queryFn: async () => {
      try {
        console.log('Fetching active debts...');
        const response = await transactionApi.getActiveDebts();
        console.log('Active debts response:', response);
        return response;
      } catch (error) {
        console.error('Error fetching active debts:', error);
        throw error;
      }
    },
    retry: 1,
    enabled: false,
  });

  return {
    accounts,
    isAccountsLoading,
    isAccountsError,
    refetchAccounts,
    categories,
    isCategoriesLoading,
    isCategoriesError,
    refetchCategories,
    submitTransaction: createMutation.mutate,
    updateTransaction: handleUpdateTransaction,
    isSubmitting,
    isSubmitError,
    isSubmitSuccess,
    submitError,
    resetSubmit,
    isAccountModalOpen,
    setAccountModalOpen,
    isCategoryModalOpen,
    setCategoryModalOpen,
    profiles,
    isProfilesLoading,
    isProfilesError,
    refetchProfiles,
    profileId,
    accountTypes,
    isAccountTypesLoading,
    isAccountTypesError,
    refetchAccountTypes,
    categoryTypes,
    isCategoryTypesLoading,
    isCategoryTypesError,
    refetchCategoryTypes,
    activeDebts,
    isActiveDebtsLoading,
    isActiveDebtsError,
    activeDebtsError,
    refetchActiveDebts,
  };
} 