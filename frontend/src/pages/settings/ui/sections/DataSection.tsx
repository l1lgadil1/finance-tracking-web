'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FiDownload, FiUpload, FiAlertCircle, FiTrash2, FiRefreshCw, FiClock } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Button, Dialog } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';
import { api } from '@/shared/api';
import { ToastProvider } from '@/shared/ui/Toast/ToastProvider';

// Define translations
const translations = {
  en: {
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    exportDescription: 'Download your financial data for backup or analysis. Choose a format below:',
    exportAsCSV: 'Export as CSV',
    exportAsJSON: 'Export as JSON',
    importData: 'Import Data',
    importDescription: 'Upload your financial data from a previous export. Supported formats: CSV, JSON.',
    chooseFile: 'Choose File',
    noFileSelected: 'No file selected',
    importButton: 'Import',
    resetProfile: 'Reset Profile',
    resetProfileDescription: 'Reset your profile to default settings. This will remove all your transactions, goals, accounts, and settings.',
    resetWarning: 'Warning: This action cannot be undone.',
    resetButton: 'Reset Profile',
    deleteAccount: 'Delete Account',
    deleteDescription: 'Permanently delete your account and all associated data.',
    deleteWarning: 'Warning: This action cannot be undone and will delete all your data.',
    deleteButton: 'Delete Account',
    confirmReset: 'Confirm Reset',
    confirmResetText: 'Are you sure you want to reset your profile? This will delete all your transactions, goals, accounts, and settings.',
    confirmDelete: 'Confirm Deletion',
    confirmDeleteText: 'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    selectProfile: 'Select Profile',
    resetSelectedProfile: 'Reset Selected Profile',
    loadingProfiles: 'Loading Profiles...',
    selectProfileInstruction: 'Select a profile to reset:',
    loadingProfilesText: 'Loading available profiles...',
    success: 'Success',
    error: 'Error',
    successReset: 'Your profile has been reset to default state',
    errorNoProfile: 'No active profile selected',
    errorReset: 'Failed to reset profile. Please try again.',
    comingSoon: 'Coming Soon',
    featureUnderDevelopment: 'This feature is currently under development and will be available soon.'
  },
  ru: {
    dataManagement: 'Управление данными',
    exportData: 'Экспорт данных',
    exportDescription: 'Скачайте свои финансовые данные для резервного копирования или анализа. Выберите формат ниже:',
    exportAsCSV: 'Экспорт в CSV',
    exportAsJSON: 'Экспорт в JSON',
    importData: 'Импорт данных',
    importDescription: 'Загрузите ваши финансовые данные из предыдущего экспорта. Поддерживаемые форматы: CSV, JSON.',
    chooseFile: 'Выбрать файл',
    noFileSelected: 'Файл не выбран',
    importButton: 'Импортировать',
    resetProfile: 'Сбросить профиль',
    resetProfileDescription: 'Сбросьте ваш профиль до настроек по умолчанию. Это удалит все ваши транзакции, цели, счета и настройки.',
    resetWarning: 'Предупреждение: Это действие нельзя отменить.',
    resetButton: 'Сбросить профиль',
    deleteAccount: 'Удалить аккаунт',
    deleteDescription: 'Навсегда удалить ваш аккаунт и все связанные данные.',
    deleteWarning: 'Предупреждение: Это действие нельзя отменить, и оно удалит все ваши данные.',
    deleteButton: 'Удалить аккаунт',
    confirmReset: 'Подтвердите сброс',
    confirmResetText: 'Вы уверены, что хотите сбросить ваш профиль? Это удалит все ваши транзакции, цели, счета и настройки.',
    confirmDelete: 'Подтвердите удаление',
    confirmDeleteText: 'Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить, и оно навсегда удалит все ваши данные.',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    selectProfile: 'Выбрать профиль',
    resetSelectedProfile: 'Сбросить выбранный профиль',
    loadingProfiles: 'Загрузка профилей...',
    selectProfileInstruction: 'Выберите профиль для сброса:',
    loadingProfilesText: 'Загрузка доступных профилей...',
    success: 'Успех',
    error: 'Ошибка',
    successReset: 'Ваш профиль был сброшен до исходного состояния',
    errorNoProfile: 'Нет активного профиля',
    errorReset: 'Не удалось сбросить профиль. Пожалуйста, попробуйте снова.',
    comingSoon: 'Скоро будет доступно',
    featureUnderDevelopment: 'Эта функция находится в разработке и будет доступна в ближайшее время.'
  }
};

interface DataSectionProps {
  locale: Locale;
}

// Simple toast interface that mimics the real useToast
interface ToastHandler {
  toast: (props: { title: string; description: string; variant?: string }) => void;
}

// Inner component that uses toast functionality
const DataSectionContent = ({ locale }: DataSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [availableProfiles, setAvailableProfiles] = useState<Array<{id: string, name: string}>>([]);
  
  const t = translations[locale];
  
  // Simple fallback toast implementation using alert
  const toast: ToastHandler['toast'] = (props) => {
    console.log(`Toast: ${props.title} - ${props.description}`);
    alert(`${props.title}: ${props.description}`);
  };
  
  // Load profiles when component mounts
  useEffect(() => {
    fetchProfiles();
    
    // Try to set the active profile as the default selected profile
    const activeProfile = getActiveProfile();
    if (activeProfile && activeProfile.id) {
      setSelectedProfileId(activeProfile.id);
    }
  }, []);
  
  // Get active profile from localStorage since we may not have the store
  const getActiveProfile = () => {
    if (typeof window !== 'undefined') {
      // Try different possible localStorage keys for profile
      const possibleKeys = ['profile-storage', 'profileStore', 'app-storage'];
      
      for (const key of possibleKeys) {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            // Check various possible paths where profile ID might be stored
            const profile = 
              parsedData.state?.activeProfile || 
              parsedData.activeProfile ||
              parsedData.state?.profile ||
              null;
              
            if (profile && profile.id) {
              console.log(`Found active profile in ${key}:`, profile);
              return profile;
            }
          } catch (e) {
            console.error(`Error parsing ${key} data:`, e);
          }
        }
      }
      
      // As a last resort, check URL for profile ID
      if (window.location.pathname.includes('/dashboard')) {
        const urlParts = window.location.pathname.split('/');
        const profileIndex = urlParts.findIndex(part => part === 'profile');
        if (profileIndex !== -1 && profileIndex < urlParts.length - 1) {
          const profileId = urlParts[profileIndex + 1];
          if (profileId && profileId.length > 10) { // Simple validation for UUID length
            console.log('Using profile ID from URL:', profileId);
            return { id: profileId };
          }
        }
      }
    }
    
    return null;
  };

  const handleExportData = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    
    try {
      // Create FormData for the body
      const formData = new FormData();
      formData.append('format', format);
      
      // Get token for authorization
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      // Use the API URL from the api client configuration
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      
      // Make a POST request to download the file
      const response = await fetch(`${API_URL}/auth/export-data`, {
        method: 'POST',
        headers: {
          'Accept': format === 'json' ? 'application/json' : 'application/zip',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aqshatracker-export.${format === 'json' ? 'json' : 'zip'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: t.success,
        description: 'Data exported successfully',
        variant: 'success',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: t.error,
        description: `Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleImportData = () => {
    if (!selectedFile) return;
    
    // Here you would normally upload the file and process it
    console.log('Importing file:', selectedFile.name);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      // Use the API client instead of direct fetch
      await api.delete('/auth/delete-account');
      
      toast({
        title: t.success,
        description: 'Your account has been deleted successfully.',
        variant: 'success',
      });
      
      // Sign out and redirect to landing page
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: t.error,
        description: `Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Function to fetch profiles from API
  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    try {
      console.log('Fetching profiles...');
      
      // Get token for authorization
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        console.warn('No auth token found - user might not be logged in');
      }
      
      // Try to fetch profiles using the api client
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.get('/profiles');
      console.log('Profiles API response:', response);
      
      // Extract data from response
      // The response structure might be different depending on the API implementation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let profilesData: any[] = [];
      
      if (Array.isArray(response)) {
        // If response is directly an array
        profilesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // If response has a data property that's an array
        profilesData = response.data;
      } else if (response && typeof response === 'object') {
        // If response is an object with another structure
        console.log('Response is an object, checking for profiles array');
        // Check for common API response patterns
        if (response.profiles && Array.isArray(response.profiles)) {
          profilesData = response.profiles;
        } else if (response.result && Array.isArray(response.result)) {
          profilesData = response.result;
        } else if (response.items && Array.isArray(response.items)) {
          profilesData = response.items;
        }
      }
      
      console.log('Extracted profiles data:', profilesData);
      
      if (profilesData && profilesData.length > 0) {
        // Map the profiles to our expected format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profiles = profilesData.map((profile: any) => ({
          id: profile.id,
          name: profile.name || `Profile ${profile.id.slice(0, 8)}`
        }));
        
        console.log('Processed profiles:', profiles);
        setAvailableProfiles(profiles);
        
        // If there's only one profile, select it automatically
        if (profiles.length === 1) {
          setSelectedProfileId(profiles[0].id);
        }
      } else {
        console.warn('No profiles found in the response');
        
        // Check if user is currently viewing a profile in the app
        // This is a fallback if the API didn't return profiles
        const activeProfile = getActiveProfile();
        if (activeProfile && activeProfile.id) {
          console.log('Using active profile from local storage:', activeProfile);
          setAvailableProfiles([{
            id: activeProfile.id,
            name: activeProfile.name || `Profile ${activeProfile.id.slice(0, 8)}`
          }]);
          setSelectedProfileId(activeProfile.id);
        }
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      
      // Fallback to active profile as a last resort
      const activeProfile = getActiveProfile();
      if (activeProfile && activeProfile.id) {
        console.log('Fallback: Using active profile from local storage:', activeProfile);
        setAvailableProfiles([{
          id: activeProfile.id,
          name: activeProfile.name || `Profile ${activeProfile.id.slice(0, 8)}`
        }]);
        setSelectedProfileId(activeProfile.id);
      }
    } finally {
      setLoadingProfiles(false);
    }
  };
  
  const handleResetProfileClick = () => {
    // If no profile is selected, try to get the active profile
    if (!selectedProfileId) {
      const activeProfile = getActiveProfile();
      if (activeProfile && activeProfile.id) {
        setSelectedProfileId(activeProfile.id);
        // Add a slight delay to allow state update
        setTimeout(() => {
          setIsResetDialogOpen(true);
        }, 50);
        return;
      }
      
      toast({
        title: t.error,
        description: t.errorNoProfile,
        variant: "error",
      });
      return;
    }
    
    setIsResetDialogOpen(true);
  };
  
  const handleConfirmReset = async () => {
    // Get the profile to reset (selected or active)
    let profileId = selectedProfileId;
    
    if (!profileId) {
      const activeProfile = getActiveProfile();
      if (activeProfile && activeProfile.id) {
        profileId = activeProfile.id;
      } else {
        toast({
          title: t.error,
          description: t.errorNoProfile,
          variant: "error",
        });
        return;
      }
    }
    
    setIsResetting(true);
    try {
      console.log('Resetting profile with ID:', profileId);
      await api.post(`/profiles/${profileId}/reset`);
      toast({
        title: t.success,
        description: t.successReset,
        variant: "success",
      });
      
      // Force refresh the dashboard data
      window.location.reload();
    } catch (error) {
      console.error('Error resetting profile:', error);
      toast({
        title: t.error,
        description: t.errorReset,
        variant: "error",
      });
    } finally {
      setIsResetting(false);
      setIsResetDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8" suppressHydrationWarning>
      {/* Data Export */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.exportData}</h2>
        </CardHeader>
        <CardBody>
          <p className="text-muted-foreground mb-6">
            {t.exportDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              leftIcon={<FiDownload />}
              onClick={() => handleExportData('csv')}
              isLoading={isExporting}
            >
              {t.exportAsCSV}
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<FiDownload />}
              onClick={() => handleExportData('json')}
              isLoading={isExporting}
            >
              {t.exportAsJSON}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Data Import */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.importData}</h2>
        </CardHeader>
        <CardBody className="relative">
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 bg-card/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 rounded-b-md">
            <div className="flex items-center gap-2 text-xl font-medium text-primary-500">
              <FiClock />
              <span>{t.comingSoon}</span>
            </div>
            <p className="text-muted-foreground mt-2 text-center max-w-md px-4">
              {t.featureUnderDevelopment}
            </p>
          </div>
          
          <p className="text-muted-foreground mb-4">
            {t.importDescription}
          </p>
          
          <div className="p-4 bg-muted/30 rounded-md border border-border mb-4">
            <div className="flex items-start">
              <FiAlertCircle className="text-warning mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Before you import</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Make sure your import file follows the required format. Incorrect formats may result in import errors or data inconsistencies.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              variant="outline"
              leftIcon={<FiUpload />}
              onClick={triggerFileInput}
              disabled={true}
            >
              {t.chooseFile}
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept=".csv,.json"
              onChange={handleFileChange}
              disabled={true}
            />
            
            {selectedFile && (
              <div className="flex-1 text-sm">
                <span className="font-medium">Selected file: </span>
                <span className="text-muted-foreground">{selectedFile.name}</span>
              </div>
            )}
          </div>
        </CardBody>
        {selectedFile && (
          <CardFooter className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleImportData}
              disabled={true}
            >
              {t.importButton}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Reset Profile */}
      <Card className="border-warning/30">
        <CardHeader>
          <h2 className="text-xl font-semibold text-warning">{t.resetProfile}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-warning/10 rounded-md border border-warning/30 mb-6">
            <div className="flex items-start">
              <FiAlertCircle className="text-warning mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-warning">{t.resetWarning}</h3>
                <p className="text-sm mt-1">
                  {t.resetProfileDescription}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="profile-select" className="block text-sm font-medium mb-2">
                {t.selectProfile}
              </label>
              
              {loadingProfiles ? (
                <div className="py-2 text-sm text-muted-foreground">{t.loadingProfiles}</div>
              ) : availableProfiles.length > 0 ? (
                <select
                  id="profile-select"
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="w-full p-3 border border-border rounded-md bg-card"
                >
                  <option value="" disabled>-- {t.selectProfile} --</option>
                  {availableProfiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} ({profile.id.slice(0, 8)}...)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-error">No profiles found from API. You can still reset your active profile:</div>
                  <div className="p-2 border border-border rounded-md bg-card">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const activeProfile = getActiveProfile();
                        if (activeProfile && activeProfile.id) {
                          setSelectedProfileId(activeProfile.id);
                          setAvailableProfiles([{
                            id: activeProfile.id,
                            name: activeProfile.name || `Active Profile (${activeProfile.id.slice(0, 8)})`
                          }]);
                          setIsResetDialogOpen(true);
                        } else {
                          toast({
                            title: t.error,
                            description: t.errorNoProfile,
                            variant: "error",
                          });
                        }
                      }}
                    >
                      Reset Active Profile
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              leftIcon={<FiRefreshCw className="text-warning" />}
              className="border-warning/50 text-warning hover:bg-warning/10"
              onClick={handleResetProfileClick}
              isLoading={isResetting}
              disabled={!selectedProfileId || loadingProfiles}
            >
              {t.resetButton}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Account Deletion */}
      <Card className="border-error/30">
        <CardHeader>
          <h2 className="text-xl font-semibold text-error">{t.deleteAccount}</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-error/10 rounded-md border border-error/30 mb-6">
            <div className="flex items-start">
              <FiAlertCircle className="text-error mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-error">{t.deleteWarning}</h3>
                <p className="text-sm mt-1">
                  {t.deleteDescription}
                </p>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            leftIcon={<FiTrash2 className="text-error" />}
            className="border-error/50 text-error hover:bg-error/10"
            onClick={() => setIsDeleteDialogOpen(true)}
            isLoading={isDeleting}
          >
            {t.deleteButton}
          </Button>
        </CardBody>
      </Card>

      {/* Reset Profile Confirmation Dialog */}
      <Dialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        title={t.confirmReset}
        primaryActionText={t.confirm}
        onPrimaryAction={handleConfirmReset}
        isPrimaryActionLoading={isResetting}
        size="md"
      >
        <p>{t.confirmResetText}</p>
        {selectedProfileId && availableProfiles.length > 0 && (
          <div className="my-3 p-3 bg-card rounded-md">
            <p className="font-medium">Selected profile:</p>
            <p>{availableProfiles.find(p => p.id === selectedProfileId)?.name || 'Unknown profile'}</p>
          </div>
        )}
        <ul className="list-disc pl-6 my-4 space-y-1">
          <li>Delete all your transactions</li>
          <li>Delete all custom categories</li>
          <li>Delete all your goals</li>
          <li>Reset all account balances to zero</li>
          <li>Recreate default categories</li>
        </ul>
        <p className="font-medium">{t.resetWarning}</p>
      </Dialog>

      {/* Deletion Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={t.confirmDelete}
        primaryActionText={t.confirm}
        onPrimaryAction={handleDeleteAccount}
        isPrimaryActionLoading={isDeleting}
        size="md"
      >
        <p>{t.confirmDeleteText}</p>
      </Dialog>
    </div>
  );
};

// Main component that wraps the content with ToastProvider
export const DataSection = ({ locale }: DataSectionProps) => {
  return (
    <ToastProvider>
      <DataSectionContent locale={locale} />
    </ToastProvider>
  );
}; 