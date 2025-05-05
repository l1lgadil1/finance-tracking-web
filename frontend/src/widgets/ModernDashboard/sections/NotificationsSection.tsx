'use client';

import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Bell, 
  AlertTriangle, 
  CreditCard, 
  Target, 
  Calendar, 
  Repeat, 
  Wallet, 
  Info, 
  TrendingUp,
  ArrowRight,
  CheckCircle 
} from 'lucide-react';
import { Locale } from '@/shared/lib/i18n';
import { Card, CardHeader, CardBody, CardFooter } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Notification, notificationTypeTranslations } from '@/shared/types/notification';
import { notificationApi, getNotificationPriorityClassName } from '@/entities/notification/api/notificationApi';
import { getRelativeTime } from '@/shared/lib/date';

interface NotificationsSectionProps {
  locale: Locale;
}

// Icon map for notification types
const iconMap: Record<string, FC<{ size?: number | string; className?: string }>> = {
  BUDGET_ALERT: AlertTriangle,
  TRANSACTION_ALERT: CreditCard,
  GOAL_MILESTONE: Target,
  DEBT_REMINDER: Calendar,
  RECURRING_PAYMENT: Repeat,
  LOW_BALANCE: Wallet,
  SYSTEM_ALERT: Info,
  SAVING_OPPORTUNITY: TrendingUp
};

// Component translations
const translations = {
  en: {
    title: 'Recent Notifications',
    viewAll: 'View all',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications',
    emptyMessage: 'You have no new notifications at this time.',
    settings: 'Settings'
  },
  ru: {
    title: 'Недавние уведомления',
    viewAll: 'Просмотреть все',
    markAllRead: 'Отметить все как прочитанные',
    noNotifications: 'Нет уведомлений',
    emptyMessage: 'У вас нет новых уведомлений на данный момент.',
    settings: 'Настройки'
  }
};

export const NotificationsSection: FC<NotificationsSectionProps> = ({ locale }) => {
  const t = translations[locale] || translations.en;
  const typeTranslations = notificationTypeTranslations[locale] || notificationTypeTranslations.en;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await notificationApi.getNotifications();
        // Get only unread notifications, limit to 5
        const unreadNotifications = data
          .filter(n => !n.read)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setNotifications(unreadNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);
  
  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications([]);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };
  
  // Mark notification as read
  const handleNotificationClick = async (notification: Notification) => {
    try {
      await notificationApi.markAsRead(notification.id);
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  // Render notification icon based on type
  const renderNotificationIcon = (type: string) => {
    const Icon = iconMap[type] || Bell;
    return <Icon size={18} className="flex-shrink-0" />;
  };
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary-100 dark:bg-primary-900/30 w-8 h-8 rounded-full flex items-center justify-center">
            <Bell className="text-primary-600 dark:text-primary-400" size={18} />
          </div>
          <h2 className="text-xl font-semibold">{t.title}</h2>
        </div>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <CheckCircle size={14} className="mr-1" />
              {t.markAllRead}
            </Button>
          )}
          <Link href="/settings/notifications" passHref>
            <Button variant="outline" size="sm">
              {t.settings}
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardBody className="pt-3">
        {loading ? (
          // Loading state
          <div className="flex justify-center items-center p-8">
            <div className="w-8 h-8 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell size={40} className="text-muted-foreground mb-3" />
            <p className="text-foreground font-medium">{t.noNotifications}</p>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
              {t.emptyMessage}
            </p>
          </div>
        ) : (
          // Notifications list
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                className={`p-3 rounded-lg border ${getNotificationPriorityClassName(notification.priority)} transition-colors duration-200 hover:bg-opacity-80 cursor-pointer`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 bg-opacity-50 rounded-full">
                    {renderNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium">
                        {typeTranslations[notification.type]}
                      </span>
                      <span className="text-xs opacity-75">
                        {getRelativeTime(notification.createdAt, locale)}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mt-1">{notification.title}</h4>
                    <p className="text-sm mt-1 line-clamp-2 opacity-80">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardBody>
      
      {notifications.length > 0 && (
        <CardFooter className="pt-0">
          <Link 
            href="/settings/notifications" 
            className="inline-flex items-center text-primary hover:underline text-sm w-full justify-center"
          >
            {t.viewAll}
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}; 