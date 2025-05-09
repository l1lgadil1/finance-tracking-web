'use client';

import { useState } from 'react';
import { FiCamera, FiSave } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Avatar } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

// Define translations
const translations = {
  en: {
    profileSettings: 'Profile Settings',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    country: 'Country/Region',
    saveChanges: 'Save Changes',
    clickToChange: 'Click on the avatar to change your profile picture',
    enterFullName: 'Enter your full name',
    enterEmail: 'Enter your email address',
    enterPhone: 'Enter your phone number',
    enterCountry: 'Enter your country or region'
  },
  ru: {
    profileSettings: 'Настройки профиля',
    fullName: 'Полное имя',
    email: 'Электронная почта',
    phone: 'Номер телефона',
    country: 'Страна/Регион',
    saveChanges: 'Сохранить изменения',
    clickToChange: 'Нажмите на аватар, чтобы изменить фото профиля',
    enterFullName: 'Введите ваше полное имя',
    enterEmail: 'Введите вашу электронную почту',
    enterPhone: 'Введите ваш номер телефона',
    enterCountry: 'Введите вашу страну или регион'
  }
};

interface ProfileSectionProps {
  locale: Locale;
}

export const ProfileSection = ({ locale }: ProfileSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States'
  });
  
  const t = translations[locale];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success notification here
    }, 1000);
  };

  const handleAvatarClick = () => {
    // Trigger file input click
    document.getElementById('avatar-upload')?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle avatar upload
      console.log('Avatar file selected:', file);
      // Here you would normally upload the file to your backend
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t.profileSettings}</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row mb-8 items-center">
            <div className="relative mb-4 sm:mb-0 sm:mr-8">
              <Avatar 
                src="" 
                name={formData.name}
                size="xl"
                onClick={handleAvatarClick}
                className="cursor-pointer"
              />
              <div 
                className="absolute bottom-0 right-0 bg-primary-500 text-white p-1.5 rounded-full cursor-pointer"
                onClick={handleAvatarClick}
              >
                <FiCamera size={16} />
              </div>
              <input 
                type="file" 
                id="avatar-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-medium">{formData.name}</h3>
              <p className="text-muted-foreground">{formData.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t.clickToChange}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label={t.fullName}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t.enterFullName}
            />
            
            <Input 
              label={t.email}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t.enterEmail}
            />
            
            <Input 
              label={t.phone}
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t.enterPhone}
            />
            
            <Input 
              label={t.country}
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder={t.enterCountry}
            />
          </div>
        </form>
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button 
          variant="primary" 
          leftIcon={<FiSave />}
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          {t.saveChanges}
        </Button>
      </CardFooter>
    </Card>
  );
}; 