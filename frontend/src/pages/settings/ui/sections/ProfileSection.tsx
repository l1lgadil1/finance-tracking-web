'use client';

import { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Input, Button } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';
import { userApi, UserProfile } from '@/entities/user';
import toast from 'react-hot-toast';

// Define translations
const translations = {
  en: {
    profileSettings: 'Profile Settings',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    saveChanges: 'Save Changes',
    enterFullName: 'Enter your full name',
    enterEmail: 'Enter your email address',
    enterPhone: 'Enter your phone number',
    profileUpdated: 'Profile updated successfully!',
    errorUpdating: 'Error updating profile. Please try again.',
    errorLoading: 'Could not load profile data.'
  },
  ru: {
    profileSettings: 'Настройки профиля',
    fullName: 'Полное имя',
    email: 'Электронная почта',
    phone: 'Номер телефона',
    saveChanges: 'Сохранить изменения',
    enterFullName: 'Введите ваше полное имя',
    enterEmail: 'Введите вашу электронную почту',
    enterPhone: 'Введите ваш номер телефона',
    profileUpdated: 'Профиль успешно обновлен!',
    errorUpdating: 'Ошибка при обновлении профиля. Пожалуйста, попробуйте снова.',
    errorLoading: 'Не удалось загрузить данные профиля.'
  }
};

interface ProfileSectionProps {
  locale: Locale;
}

export const ProfileSection = ({ locale }: ProfileSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: ''
  });
  
  const t = translations[locale];

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const userProfile = await userApi.getProfile();
        setFormData({
          name: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.phone || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error(t.errorLoading);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [t.errorLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await userApi.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      toast.success(t.profileUpdated);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t.errorUpdating);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t.profileSettings}</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center py-16">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t.profileSettings}</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
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