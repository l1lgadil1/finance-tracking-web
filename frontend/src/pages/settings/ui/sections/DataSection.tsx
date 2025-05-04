'use client';
import React, { useState, useRef } from 'react';
import { FiDownload, FiUpload, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Button, Dialog } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

interface DataSectionProps {
  locale: Locale;
}

export const DataSection = ({ locale }: DataSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  return (
    <div className="space-y-8" suppressHydrationWarning>
      {/* Data Export */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Export Your Data</h2>
        </CardHeader>
        <CardBody>
          <p className="text-muted-foreground mb-6">
            Download a copy of your data in CSV or JSON format.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              leftIcon={<FiDownload />}
              onClick={() => handleExportData('csv')}
              isLoading={isExporting}
            >
              Export as CSV
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<FiDownload />}
              onClick={() => handleExportData('json')}
              isLoading={isExporting}
            >
              Export as JSON
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Data Import */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Import Data</h2>
        </CardHeader>
        <CardBody>
          <p className="text-muted-foreground mb-4">
            Import data from a CSV or JSON file. This will add to your existing data.
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
              Select File
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
              Import Data
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Account Deletion */}
      <Card className="border-error/30">
        <CardHeader>
          <h2 className="text-xl font-semibold text-error">Delete Account</h2>
        </CardHeader>
        <CardBody>
          <div className="p-4 bg-error/10 rounded-md border border-error/30 mb-6">
            <div className="flex items-start">
              <FiAlertCircle className="text-error mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-error">Danger Zone</h3>
                <p className="text-sm mt-1">
                  Deleting your account is permanent. All your data will be permanently removed and cannot be recovered.
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
            Delete my account
          </Button>
        </CardBody>
      </Card>

      {/* Deletion Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Account"
        primaryActionText="Yes, delete my account"
        onPrimaryAction={handleDeleteAccount}
        size="md"
      >
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
      </Dialog>
    </div>
  );
}; 