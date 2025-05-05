export type NotificationType = 
  | 'BUDGET_ALERT'     // When a budget is near or exceeds limit
  | 'TRANSACTION_ALERT' // For suspicious or large transactions  
  | 'GOAL_MILESTONE'   // When financial goal milestone is reached
  | 'DEBT_REMINDER'    // Reminder about debt payment
  | 'RECURRING_PAYMENT' // Upcoming recurring payment
  | 'LOW_BALANCE'      // When account balance is running low
  | 'SYSTEM_ALERT'     // System updates, maintenance, etc.
  | 'SAVING_OPPORTUNITY'; // AI-generated saving tip

export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  priority: NotificationPriority;
  relatedEntityId?: string; // ID of related account, transaction, goal, etc.
  relatedEntityType?: string; // Type of related entity (account, transaction, goal)
  actionUrl?: string; // URL to navigate to when notification is clicked
}

export interface GroupedNotifications {
  date: string; // Formatted date string
  notifications: Notification[];
}

// Translation keys for notification types
export const notificationTypeTranslations = {
  en: {
    BUDGET_ALERT: 'Budget Alert',
    TRANSACTION_ALERT: 'Transaction Alert',
    GOAL_MILESTONE: 'Goal Milestone',
    DEBT_REMINDER: 'Debt Reminder',
    RECURRING_PAYMENT: 'Recurring Payment',
    LOW_BALANCE: 'Low Balance',
    SYSTEM_ALERT: 'System Alert',
    SAVING_OPPORTUNITY: 'Saving Opportunity'
  },
  ru: {
    BUDGET_ALERT: 'Предупреждение о бюджете',
    TRANSACTION_ALERT: 'Предупреждение о транзакции',
    GOAL_MILESTONE: 'Этап цели',
    DEBT_REMINDER: 'Напоминание о долге',
    RECURRING_PAYMENT: 'Регулярный платеж',
    LOW_BALANCE: 'Низкий баланс',
    SYSTEM_ALERT: 'Системное уведомление',
    SAVING_OPPORTUNITY: 'Возможность сбережения'
  }
}; 