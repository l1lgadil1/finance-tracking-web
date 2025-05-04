import { api } from '@/shared/api/api';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SupportResource {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionLabel: string;
  actionUrl: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export const supportApi = {
  getFAQs: () => 
    api.get<FAQItem[]>('/support/faqs'),
    
  getSupportResources: () => 
    api.get<SupportResource[]>('/support/resources'),
    
  createSupportTicket: (data: { subject: string; message: string }) => 
    api.post<SupportTicket>('/support/tickets', data),
    
  getSupportTickets: () => 
    api.get<SupportTicket[]>('/support/tickets'),
    
  getSupportTicket: (ticketId: string) => 
    api.get<SupportTicket>(`/support/tickets/${ticketId}`),
    
  addTicketReply: (ticketId: string, message: string) => 
    api.post<{ success: boolean }>(`/support/tickets/${ticketId}/replies`, { message }),
    
  closeTicket: (ticketId: string) => 
    api.patch<{ success: boolean }>(`/support/tickets/${ticketId}`, { status: 'closed' }),
}; 