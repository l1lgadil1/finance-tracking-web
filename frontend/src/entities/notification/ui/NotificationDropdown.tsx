'use client';

import { useState, useEffect, FC, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Bell, 
  CheckCircle, 
  X, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CreditCard, 
  Target, 
  Calendar, 
  Repeat, 
  Wallet, 
  Info, 
  TrendingUp 
} from 'lucide-react';
import { Locale } from '@/shared/lib/i18n';
import { 
  Notification, 
  NotificationType, 
  GroupedNotifications,
  notificationTypeTranslations 
} from '@/shared/types/notification';
import { formatDisplayDate, getRelativeTime } from '@/shared/lib/date';
import { 
  notificationApi, 
  getNotificationPriorityClassName
} from '../api/notificationApi';
import { Button } from '@/shared/ui/Button';

interface NotificationDropdownProps {
  locale: Locale;
}

// Translations
const translations = {
  en: {
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No notifications',
    emptyMessage: 'You have no new notifications at this time.',
    today: 'Today',
    yesterday: 'Yesterday',
    viewAll: 'View all notifications',
    close: 'Close',
    clearAll: 'Clear all',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
  },
  ru: {
    notifications: 'Уведомления',
    markAllRead: 'Отметить все как прочитанные',
    noNotifications: 'Нет уведомлений',
    emptyMessage: 'У вас нет новых уведомлений на данный момент.',
    today: 'Сегодня',
    yesterday: 'Вчера',
    viewAll: 'Просмотреть все уведомления',
    close: 'Закрыть',
    clearAll: 'Очистить все',
    expandAll: 'Развернуть все',
    collapseAll: 'Свернуть все',
  }
};

// Icon map for notification types
const iconMap: Record<NotificationType, FC<{ size?: number | string; className?: string }>> = {
  BUDGET_ALERT: AlertTriangle,
  TRANSACTION_ALERT: CreditCard,
  GOAL_MILESTONE: Target,
  DEBT_REMINDER: Calendar,
  RECURRING_PAYMENT: Repeat,
  LOW_BALANCE: Wallet,
  SYSTEM_ALERT: Info,
  SAVING_OPPORTUNITY: TrendingUp
};

export const NotificationDropdown: FC<NotificationDropdownProps> = ({ locale }) => {
  const t = translations[locale] || translations.en;
  const typeTranslations = notificationTypeTranslations[locale] || notificationTypeTranslations.en;
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState<GroupedNotifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await notificationApi.getNotifications();
        setNotifications(data);
        const grouped = notificationApi.groupNotificationsByDate(data);
        setGroupedNotifications(grouped);
        
        // By default, expand today's notifications
        if (grouped.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          if (grouped.some(g => g.date === today)) {
            setExpandedGroups([today]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Refetch when dropdown opens
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mark notification as read and navigate to related entity
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await notificationApi.markAsRead(notification.id);
        
        // Update local state
        setNotifications(prev => prev.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        ));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // Navigate to the related entity if actionUrl is provided
    if (notification.actionUrl) {
      setIsOpen(false);
      router.push(notification.actionUrl);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Toggle group expansion
  const toggleGroup = (date: string) => {
    setExpandedGroups(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  // Toggle all groups
  const toggleAllGroups = () => {
    if (expandedGroups.length === groupedNotifications.length) {
      setExpandedGroups([]);
    } else {
      setExpandedGroups(groupedNotifications.map(g => g.date));
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Format date heading
  const formatDateHeading = (dateStr: string): string => {
    return formatDisplayDate(dateStr, locale);
  };

  // Render notification icon based on type
  const renderNotificationIcon = (type: NotificationType) => {
    const Icon = iconMap[type];
    return <Icon size={20} className="flex-shrink-0" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-accent transition-colors duration-200"
        aria-label={t.notifications}
      >
        <Bell size={20} className="text-foreground" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-md shadow-lg z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-medium">{t.notifications}</h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs h-7 px-2"
                  >
                    <CheckCircle size={12} className="mr-1" />
                    {t.markAllRead}
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={t.close}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Notification List */}
            <div className="max-h-[420px] overflow-y-auto">
              {loading ? (
                // Loading state
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="w-6 h-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
                </div>
              ) : notifications.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center p-8">
                  <Bell size={40} className="text-muted-foreground mb-2" />
                  <p className="text-foreground font-medium">{t.noNotifications}</p>
                  <p className="text-muted-foreground text-sm text-center mt-1">
                    {t.emptyMessage}
                  </p>
                </div>
              ) : (
                // Notifications grouped by date
                <div>
                  {/* Controls for expand/collapse all */}
                  <div className="flex justify-between items-center px-4 py-2 bg-muted/30">
                    <button
                      onClick={toggleAllGroups}
                      className="text-xs flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {expandedGroups.length === groupedNotifications.length ? (
                        <>
                          <ChevronUp size={14} className="mr-1" />
                          {t.collapseAll}
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} className="mr-1" />
                          {t.expandAll}
                        </>
                      )}
                    </button>
                  </div>
                  
                  {groupedNotifications.map((group) => (
                    <div key={group.date} className="border-b border-border last:border-0">
                      {/* Date Header */}
                      <button
                        onClick={() => toggleGroup(group.date)}
                        className="w-full flex items-center justify-between p-3 text-sm font-medium bg-muted/40 hover:bg-muted/60 transition-colors duration-200"
                      >
                        <span>{formatDateHeading(group.date)}</span>
                        {expandedGroups.includes(group.date) ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                      
                      {/* Notification Items */}
                      <AnimatePresence>
                        {expandedGroups.includes(group.date) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {group.notifications.map((notification) => (
                              <button
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`w-full text-left p-3 border-t border-border flex items-start hover:bg-muted/40 transition-colors duration-200 ${notification.read ? 'opacity-70' : ''}`}
                              >
                                {/* Icon with priority color */}
                                <div className={`mr-3 p-2 rounded-full ${getNotificationPriorityClassName(notification.priority)}`}>
                                  {renderNotificationIcon(notification.type)}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  {/* Type and time */}
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium">
                                      {typeTranslations[notification.type]}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {getRelativeTime(notification.createdAt, locale)}
                                    </span>
                                  </div>
                                  
                                  {/* Title */}
                                  <h4 className="font-medium text-sm truncate">
                                    {notification.title}
                                  </h4>
                                  
                                  {/* Message */}
                                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                </div>
                                
                                {/* Unread indicator */}
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border">
                <Link 
                  href="/settings/notifications"
                  className="block w-full text-center text-primary hover:underline text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {t.viewAll}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 