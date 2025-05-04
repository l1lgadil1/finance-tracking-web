'use client';

import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Button, Checkbox } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

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
  // Example notification preferences data
  const [notifications, setNotifications] = useState<NotificationCategory[]>([
    {
      id: 'account',
      name: 'Account',
      description: 'Notifications related to your account',
      notifications: [
        {
          id: 'account-login',
          name: 'New login',
          description: 'When a new device logs into your account',
          email: true,
          push: true,
          sms: false
        },
        {
          id: 'account-password',
          name: 'Password changes',
          description: 'When your password is changed',
          email: true,
          push: true,
          sms: false
        }
      ]
    },
    {
      id: 'finance',
      name: 'Finance',
      description: 'Notifications related to your financial activity',
      notifications: [
        {
          id: 'finance-transaction',
          name: 'New transactions',
          description: 'When a new transaction is recorded',
          email: false,
          push: true,
          sms: false
        },
        {
          id: 'finance-budget',
          name: 'Budget alerts',
          description: 'When you approach or exceed budget limits',
          email: true,
          push: true,
          sms: false
        },
        {
          id: 'finance-goals',
          name: 'Goal progress',
          description: 'Updates on your financial goals',
          email: true,
          push: false,
          sms: false
        }
      ]
    },
    {
      id: 'system',
      name: 'System',
      description: 'System and platform notifications',
      notifications: [
        {
          id: 'system-updates',
          name: 'Platform updates',
          description: 'News about platform updates and features',
          email: true,
          push: false,
          sms: false
        },
        {
          id: 'system-maintenance',
          name: 'Maintenance alerts',
          description: 'Planned maintenance notifications',
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

  const areAllDisabled = (categoryId: string, channel: 'email' | 'push' | 'sms') => {
    const category = notifications.find(c => c.id === categoryId);
    return category?.notifications.every(n => !n[channel]) || false;
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
        <h2 className="text-xl font-semibold">Notification Preferences</h2>
      </CardHeader>
      <CardBody>
        <p className="text-muted-foreground mb-6">
          Manage how you receive notifications across channels.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-foreground">Notification</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">Email</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">Push</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">SMS</th>
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
                      Toggle all {category.name.toLowerCase()} notifications
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
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}; 