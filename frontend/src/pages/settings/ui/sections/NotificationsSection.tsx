'use client';

import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Button, Checkbox } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

// Define translations
const translations = {
  en: {
    notificationPreferences: 'Notification Preferences',
    manageNotifications: 'Manage how you receive notifications across channels.',
    notification: 'Notification',
    email: 'Email',
    push: 'Push',
    sms: 'SMS',
    enableAll: 'Enable all',
    disableAll: 'Disable all',
    saveChanges: 'Save Changes',
    toggleAll: 'Toggle all',
    categories: {
      account: {
        name: 'Account',
        description: 'Notifications related to your account',
        newLogin: 'New login',
        newLoginDesc: 'When a new device logs into your account',
        passwordChanges: 'Password changes',
        passwordChangesDesc: 'When your password is changed'
      },
      finance: {
        name: 'Finance',
        description: 'Notifications related to your financial activity',
        newTransactions: 'New transactions',
        newTransactionsDesc: 'When a new transaction is recorded',
        budgetAlerts: 'Budget alerts',
        budgetAlertsDesc: 'When you approach or exceed budget limits',
        goalProgress: 'Goal progress',
        goalProgressDesc: 'Updates on your financial goals'
      },
      system: {
        name: 'System',
        description: 'System and platform notifications',
        platformUpdates: 'Platform updates',
        platformUpdatesDesc: 'News about platform updates and features',
        maintenanceAlerts: 'Maintenance alerts',
        maintenanceAlertsDesc: 'Planned maintenance notifications'
      }
    }
  },
  ru: {
    notificationPreferences: 'Настройки уведомлений',
    manageNotifications: 'Управляйте тем, как вы получаете уведомления по различным каналам.',
    notification: 'Уведомление',
    email: 'Эл. почта',
    push: 'Push',
    sms: 'СМС',
    enableAll: 'Включить все',
    disableAll: 'Отключить все',
    saveChanges: 'Сохранить изменения',
    toggleAll: 'Переключить все',
    categories: {
      account: {
        name: 'Аккаунт',
        description: 'Уведомления, связанные с вашим аккаунтом',
        newLogin: 'Новый вход',
        newLoginDesc: 'Когда новое устройство входит в ваш аккаунт',
        passwordChanges: 'Изменения пароля',
        passwordChangesDesc: 'Когда ваш пароль изменен'
      },
      finance: {
        name: 'Финансы',
        description: 'Уведомления, связанные с вашей финансовой активностью',
        newTransactions: 'Новые транзакции',
        newTransactionsDesc: 'Когда регистрируется новая транзакция',
        budgetAlerts: 'Бюджетные оповещения',
        budgetAlertsDesc: 'Когда вы приближаетесь к лимиту бюджета или превышаете его',
        goalProgress: 'Прогресс цели',
        goalProgressDesc: 'Обновления о ваших финансовых целях'
      },
      system: {
        name: 'Система',
        description: 'Системные уведомления и уведомления платформы',
        platformUpdates: 'Обновления платформы',
        platformUpdatesDesc: 'Новости об обновлениях и функциях платформы',
        maintenanceAlerts: 'Оповещения о техобслуживании',
        maintenanceAlertsDesc: 'Уведомления о плановом техобслуживании'
      }
    }
  }
};

interface NotificationSectionProps {
  locale: Locale;
}

type NotificationCategory = {
  id: string;
  name: string;
  description: string;
  notifications: Notification[];
};

type Notification = {
  id: string;
  name: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
};

export const NotificationsSection = ({ locale }: NotificationSectionProps) => {
  const t = translations[locale];
  
  // Example notification preferences data
  const [notifications, setNotifications] = useState<NotificationCategory[]>([
    {
      id: 'account',
      name: t.categories.account.name,
      description: t.categories.account.description,
      notifications: [
        {
          id: 'account-login',
          name: t.categories.account.newLogin,
          description: t.categories.account.newLoginDesc,
          email: true,
          push: true,
          sms: false
        },
        {
          id: 'account-password',
          name: t.categories.account.passwordChanges,
          description: t.categories.account.passwordChangesDesc,
          email: true,
          push: true,
          sms: false
        }
      ]
    },
    {
      id: 'finance',
      name: t.categories.finance.name,
      description: t.categories.finance.description,
      notifications: [
        {
          id: 'finance-transaction',
          name: t.categories.finance.newTransactions,
          description: t.categories.finance.newTransactionsDesc,
          email: false,
          push: true,
          sms: false
        },
        {
          id: 'finance-budget',
          name: t.categories.finance.budgetAlerts,
          description: t.categories.finance.budgetAlertsDesc,
          email: true,
          push: true,
          sms: false
        },
        {
          id: 'finance-goals',
          name: t.categories.finance.goalProgress,
          description: t.categories.finance.goalProgressDesc,
          email: true,
          push: false,
          sms: false
        }
      ]
    },
    {
      id: 'system',
      name: t.categories.system.name,
      description: t.categories.system.description,
      notifications: [
        {
          id: 'system-updates',
          name: t.categories.system.platformUpdates,
          description: t.categories.system.platformUpdatesDesc,
          email: true,
          push: false,
          sms: false
        },
        {
          id: 'system-maintenance',
          name: t.categories.system.maintenanceAlerts,
          description: t.categories.system.maintenanceAlertsDesc,
          email: true,
          push: true,
          sms: false
        }
      ]
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (categoryId: string, notificationId: string, channel: 'email' | 'push' | 'sms') => {
    setNotifications(prevState => 
      prevState.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            notifications: category.notifications.map(notification => {
              if (notification.id === notificationId) {
                return {
                  ...notification,
                  [channel]: !notification[channel]
                };
              }
              return notification;
            })
          };
        }
        return category;
      })
    );
  };

  const handleToggleAll = (categoryId: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setNotifications(prevState => 
      prevState.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            notifications: category.notifications.map(notification => ({
              ...notification,
              [channel]: value
            }))
          };
        }
        return category;
      })
    );
  };

  const areAllEnabled = (categoryId: string, channel: 'email' | 'push' | 'sms') => {
    const category = notifications.find(c => c.id === categoryId);
    return category?.notifications.every(n => n[channel]) || false;
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success notification
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t.notificationPreferences}</h2>
      </CardHeader>
      <CardBody>
        <p className="text-muted-foreground mb-6">
          {t.manageNotifications}
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-foreground">{t.notification}</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">{t.email}</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">{t.push}</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">{t.sms}</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(category => (
                <React.Fragment key={category.id}>
                  <tr className="bg-muted/30">
                    <td className="py-3 px-4 font-medium" colSpan={4}>
                      <div>
                        <span>{category.name}</span>
                        <p className="text-sm text-muted-foreground mt-0.5">{category.description}</p>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {t.toggleAll} {category.name.toLowerCase()} {t.notification.toLowerCase()}s
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Checkbox 
                        checked={areAllEnabled(category.id, 'email')}
                        onChange={() => handleToggleAll(category.id, 'email', !areAllEnabled(category.id, 'email'))}
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Checkbox 
                        checked={areAllEnabled(category.id, 'push')}
                        onChange={() => handleToggleAll(category.id, 'push', !areAllEnabled(category.id, 'push'))}
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Checkbox 
                        checked={areAllEnabled(category.id, 'sms')}
                        onChange={() => handleToggleAll(category.id, 'sms', !areAllEnabled(category.id, 'sms'))}
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {areAllEnabled(category.id, 'email') ? t.disableAll : t.enableAll} {category.name.toLowerCase()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Checkbox 
                        checked={areAllEnabled(category.id, 'email')}
                        onChange={() => handleToggleAll(category.id, 'email', !areAllEnabled(category.id, 'email'))}
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Checkbox 
                        checked={areAllEnabled(category.id, 'push')}
                        onChange={() => handleToggleAll(category.id, 'push', !areAllEnabled(category.id, 'push'))}
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Checkbox 
                        checked={areAllEnabled(category.id, 'sms')}
                        onChange={() => handleToggleAll(category.id, 'sms', !areAllEnabled(category.id, 'sms'))}
                      />
                    </td>
                  </tr>
                  {category.notifications.map(notification => (
                    <tr key={notification.id} className="border-b border-border">
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-medium">{notification.name}</span>
                          <p className="text-sm text-muted-foreground mt-0.5">{notification.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox 
                          checked={notification.email}
                          onChange={() => handleToggle(category.id, notification.id, 'email')}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox 
                          checked={notification.push}
                          onChange={() => handleToggle(category.id, notification.id, 'push')}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox 
                          checked={notification.sms}
                          onChange={() => handleToggle(category.id, notification.id, 'sms')}
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button 
          variant="primary" 
          leftIcon={<FiSave />}
          isLoading={isLoading}
          onClick={handleSave}
        >
          {t.saveChanges}
        </Button>
      </CardFooter>
    </Card>
  );
}; 