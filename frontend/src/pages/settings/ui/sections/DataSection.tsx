'use client';
import React, { useState, useRef } from 'react';
import { FiDownload, FiUpload, FiAlertCircle, FiTrash2, FiRefreshCw } from 'react-icons/fi';
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
    resetProfileDescription: 'Reset your profile to default settings. This will remove all your transactions, accounts, and settings.',
    resetWarning: 'Warning: This action cannot be undone.',
    resetButton: 'Reset Profile',
    deleteAccount: 'Delete Account',
    deleteDescription: 'Permanently delete your account and all associated data.',
    deleteWarning: 'Warning: This action cannot be undone and will delete all your data.',
    deleteButton: 'Delete Account',
    confirmReset: 'Confirm Reset',
    confirmResetText: 'Are you sure you want to reset your profile? This will delete all your transactions, accounts, and settings.',
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
    errorReset: 'Failed to reset profile. Please try again.'
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
    resetProfileDescription: 'Сбросьте ваш профиль до настроек по умолчанию. Это удалит все ваши транзакции, счета и настройки.',
    resetWarning: 'Предупреждение: Это действие нельзя отменить.',
    resetButton: 'Сбросить профиль',
    deleteAccount: 'Удалить аккаунт',
    deleteDescription: 'Навсегда удалить ваш аккаунт и все связанные данные.',
    deleteWarning: 'Предупреждение: Это действие нельзя отменить, и оно удалит все ваши данные.',
    deleteButton: 'Удалить аккаунт',
    confirmReset: 'Подтвердите сброс',
    confirmResetText: 'Вы уверены, что хотите сбросить ваш профиль? Это удалит все ваши транзакции, счета и настройки.',
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
    errorReset: 'Не удалось сбросить профиль. Пожалуйста, попробуйте снова.'
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualProfileIdDialogOpen, setManualProfileIdDialogOpen] = useState(false);
  const [manualProfileId, setManualProfileId] = useState('');
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [availableProfiles, setAvailableProfiles] = useState<Array<{id: string, name: string}>>([]);
  
  const t = translations[locale];
  
  // Simple fallback toast implementation using alert
  const toast: ToastHandler['toast'] = (props) => {
    console.log(`Toast: ${props.title} - ${props.description}`);
    alert(`${props.title}: ${props.description}`);
  };
  
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

  const handleExportData = (format: 'csv' | 'json') => {
    setIsExporting(true);
    
    // Simulate API call for data export
    setTimeout(() => {
      // This would normally be an API call to generate the export file
      const dummyData = format === 'json' 
        ? JSON.stringify({ transactions: [], accounts: [], categories: [] })
        : 'id,date,amount,description,category,account\n';
      
      // Create a downloadable file
      const blob = new Blob(
        [dummyData], 
        { type: format === 'json' ? 'application/json' : 'text/csv' }
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aqshatracker-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 1500);
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

  const handleDeleteAccount = () => {
    // Here you would normally call an API to delete the account
    console.log('Account deletion requested');
    setIsDeleteDialogOpen(false);
  };

  // Function to fetch profiles from API
  const fetchProfiles = async () => {
    if (availableProfiles.length > 0) return;
    
    setLoadingProfiles(true);
    try {
      // Use any type to avoid type issues for now
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.get('/profiles');
      
      if (response && response.data && Array.isArray(response.data)) {
        // Now we know data is an array, map it to our expected format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profiles = response.data.map((profile: any) => ({
          id: profile.id,
          name: profile.name || `Profile ${profile.id.slice(0, 8)}`
        }));
        
        setAvailableProfiles(profiles);
        // If there's only one profile, select it automatically
        if (profiles.length === 1) {
          setManualProfileId(profiles[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoadingProfiles(false);
    }
  };
  
  // Modify handleResetProfile to also fetch profiles when showing the manual dialog
  const handleResetProfile = async () => {
    const activeProfile = getActiveProfile();
    
    if (!activeProfile) {
      // Show dialog to enter profile ID manually
      setManualProfileIdDialogOpen(true);
      // Try to fetch available profiles
      fetchProfiles();
      return;
    }

    proceedWithProfileReset(activeProfile);
  };
  
  const proceedWithProfileReset = async (profile: { id: string }) => {
    setIsResetting(true);
    try {
      console.log('Resetting profile with ID:', profile.id);
      await api.post(`/profiles/${profile.id}/reset`);
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
  
  const handleManualProfileSubmit = () => {
    if (manualProfileId.trim()) {
      setManualProfileIdDialogOpen(false);
      proceedWithProfileReset({ id: manualProfileId.trim() });
    } else {
      toast({
        title: t.error,
        description: t.errorNoProfile,
        variant: "error",
      });
    }
  };

  // Manual Profile ID Dialog
  const renderManualProfileDialog = () => (
    <Dialog
      isOpen={manualProfileIdDialogOpen}
      onClose={() => setManualProfileIdDialogOpen(false)}
      title={loadingProfiles ? t.loadingProfiles : t.selectProfile}
      primaryActionText={t.resetSelectedProfile}
      onPrimaryAction={handleManualProfileSubmit}
      size="md"
    >
      {loadingProfiles ? (
        <div className="text-center py-4">{t.loadingProfilesText}</div>
      ) : availableProfiles.length > 0 ? (
        <div className="space-y-4">
          <p>{t.selectProfileInstruction}</p>
          <select
            value={manualProfileId}
            onChange={(e) => setManualProfileId(e.target.value)}
            className="w-full p-3 border border-border rounded-md bg-card"
          >
            <option value="" disabled>-- Select a profile --</option>
            {availableProfiles.map(profile => (
              <option key={profile.id} value={profile.id}>
                {profile.name} ({profile.id.slice(0, 8)}...)
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="space-y-4">
          <p>No profiles found or failed to load profiles. Please enter the profile ID manually:</p>
          <input
            type="text"
            value={manualProfileId}
            onChange={(e) => setManualProfileId(e.target.value)}
            className="w-full p-2 border border-border rounded-md"
            placeholder="Enter profile ID..."
          />
        </div>
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        <p>Resetting a profile will delete all transactions, custom categories, and reset account balances.</p>
      </div>
    </Dialog>
  );

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
        <CardBody>
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
            >
              {t.chooseFile}
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept=".csv,.json"
              onChange={handleFileChange}
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
          
          <Button
            variant="outline"
            leftIcon={<FiRefreshCw className="text-warning" />}
            className="border-warning/50 text-warning hover:bg-warning/10"
            onClick={() => setIsResetDialogOpen(true)}
          >
            {t.resetButton}
          </Button>
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
        onPrimaryAction={handleResetProfile}
        isPrimaryActionLoading={isResetting}
        size="md"
      >
        <p>{t.confirmResetText}</p>
        <ul className="list-disc pl-6 my-4 space-y-1">
          <li>Delete all your transactions</li>
          <li>Delete all custom categories</li>
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
        size="md"
      >
        <p>{t.confirmDeleteText}</p>
      </Dialog>

      {/* Manual Profile ID Dialog */}
      {renderManualProfileDialog()}
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