import { 
  Notification, 
  NotificationType, 
  GroupedNotifications 
} from '@/shared/types/notification';
import { formatDate } from '@/shared/lib/date';

// Mock notification data (will be replaced with actual API calls)
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'BUDGET_ALERT',
    title: 'Food Budget Alert',
    message: 'You have spent 90% of your food budget for this month.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    priority: 'high',
    relatedEntityId: 'budget-123',
    relatedEntityType: 'budget',
    actionUrl: '/budgets/123'
  },
  {
    id: '2',
    type: 'GOAL_MILESTONE',
    title: 'Vacation Goal Progress',
    message: 'You have reached 50% of your vacation savings goal!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    priority: 'medium',
    relatedEntityId: 'goal-456',
    relatedEntityType: 'goal',
    actionUrl: '/goals/456'
  },
  {
    id: '3',
    type: 'TRANSACTION_ALERT',
    title: 'Large Transaction',
    message: 'A large transaction of $1,200 was made from your main account.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
    priority: 'high',
    relatedEntityId: 'transaction-789',
    relatedEntityType: 'transaction',
    actionUrl: '/transactions/789'
  },
  {
    id: '4',
    type: 'DEBT_REMINDER',
    title: 'Credit Card Payment Due',
    message: 'Your credit card payment of $450 is due in 3 days.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: false,
    priority: 'high',
    relatedEntityId: 'account-101',
    relatedEntityType: 'account',
    actionUrl: '/accounts/101'
  },
  {
    id: '5',
    type: 'SAVING_OPPORTUNITY',
    title: 'Potential Saving Opportunity',
    message: 'You could save $25 monthly by adjusting your subscription services.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true,
    priority: 'low',
    actionUrl: '/analytics/opportunities'
  },
  {
    id: '6',
    type: 'SYSTEM_ALERT',
    title: 'App Update Available',
    message: 'A new version of AqshaTracker with improved features is available.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    read: true,
    priority: 'low',
    actionUrl: '/settings/system'
  }
];

export const notificationApi = {
  // Get all notifications
  getNotifications: async (): Promise<Notification[]> => {
    // In a real implementation, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_NOTIFICATIONS);
      }, 500);
    });
  },

  // Mark a notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    // In a real implementation, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = MOCK_NOTIFICATIONS.find(n => n.id === id);
        if (notification) {
          notification.read = true;
        }
        resolve(notification as Notification);
      }, 300);
    });
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    // In a real implementation, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_NOTIFICATIONS.forEach(n => {
          n.read = true;
        });
        resolve();
      }, 300);
    });
  },

  // Delete a notification
  deleteNotification: async (id: string): Promise<void> => {
    // In a real implementation, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === id);
        if (index !== -1) {
          MOCK_NOTIFICATIONS.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  },

  // Group notifications by date
  groupNotificationsByDate: (notifications: Notification[]): GroupedNotifications[] => {
    const grouped: Record<string, Notification[]> = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.createdAt);
      const dateStr = formatDate(date, 'yyyy-MM-dd');
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      
      grouped[dateStr].push(notification);
    });
    
    // Convert to array and sort by date (newest first)
    return Object.entries(grouped)
      .map(([date, notifications]) => ({
        date,
        notifications: notifications.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};

export const getNotificationPriorityClassName = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-error-100 dark:bg-error-900/20 text-error-700 dark:text-error-400 border-error-300 dark:border-error-800';
    case 'medium':
      return 'bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 border-warning-300 dark:border-warning-800';
    case 'low':
    default:
      return 'bg-info-100 dark:bg-info-900/20 text-info-700 dark:text-info-400 border-info-300 dark:border-info-800';
  }
};

export const getNotificationTypeIconName = (type: NotificationType): string => {
  switch (type) {
    case 'BUDGET_ALERT':
      return 'alert-triangle';
    case 'TRANSACTION_ALERT':
      return 'credit-card';
    case 'GOAL_MILESTONE':
      return 'target';
    case 'DEBT_REMINDER':
      return 'calendar';
    case 'RECURRING_PAYMENT':
      return 'repeat';
    case 'LOW_BALANCE':
      return 'wallet';
    case 'SYSTEM_ALERT':
      return 'info';
    case 'SAVING_OPPORTUNITY':
      return 'trending-up';
    default:
      return 'bell';
  }
}; 