import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';
import { Button } from '@/shared/ui/Button';
import { BiBrain } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { IoResize } from 'react-icons/io5';
import { 
  aiAssistantApi, 
  ChatMessage,
  Conversation
} from '@/entities/ai/api/aiAssistantApi';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { IoChevronBack } from 'react-icons/io5';

// Define CSS styles for finance data
const financeStyles = {
  financeData: {
    fontFamily: 'var(--font-sans)',
  },
  financeDataSection: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(160, 174, 192, 0.2)',
  },
  financeDataLabel: {
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  financeDataValue: {
    fontWeight: 700,
  },
  financeWarning: {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    backgroundColor: 'rgba(254, 202, 202, 0.3)',
    color: 'rgb(185, 28, 28)',
  },
  financeWarningLabel: {
    fontWeight: 600,
    display: 'block',
    marginBottom: '0.25rem',
  },
  financeWarningContent: {
    display: 'block',
  },
};

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

// Define translations
const translations = {
  en: {
    title: 'AI Assistant',
    description: "I'm your personal finance assistant. Ask me anything about your finances, and I'll help you make better financial decisions.",
    welcomeMessage: "Hello! How can I help you with your finances today?",
    inputPlaceholder: "Type your question here...",
    close: "Close",
    send: "Send",
    loading: "Loading...",
    error: "Sorry, I couldn't process your request. Please try again.",
    errorLoadingHistory: "Error loading conversation history.",
    errorLoadingChat: "Error loading conversation.",
    conversationHistory: "Conversation History",
    newConversation: "New Conversation",
    untitledConversation: "Untitled Conversation",
    currentChat: "Current Chat",
    history: "History",
    backToHistory: "Back to History",
    noConversations: "No conversations yet. Start a new one!"
  },
  ru: {
    title: 'AI Ассистент',
    description: 'Я ваш личный финансовый помощник. Спросите меня о чем угодно касательно ваших финансов, и я помогу вам принимать лучшие финансовые решения.',
    welcomeMessage: 'Здравствуйте! Как я могу помочь вам с финансами сегодня?',
    inputPlaceholder: 'Введите ваш вопрос здесь...',
    close: 'Закрыть',
    send: 'Отправить',
    loading: "Загрузка...",
    error: "Извините, я не смог обработать ваш запрос. Пожалуйста, попробуйте снова.",
    errorLoadingHistory: "Ошибка загрузки истории разговоров.",
    errorLoadingChat: "Ошибка загрузки разговора.",
    conversationHistory: "История разговоров",
    newConversation: "Новый разговор",
    untitledConversation: "Безымянный разговор",
    currentChat: "Текущий чат",
    history: "История",
    backToHistory: "Вернуться к истории",
    noConversations: "Нет разговоров. Начните новый!"
  }
};

// Format finance message - handles special data formats like account balances
const formatFinanceMessage = (message: string) => {
  // Handle account balance sections with ** markers
  const formattedMessage = message.replace(
    /\*\*(.*?):\*\*(.*?)(?=-\s*\*\*|$)/g, 
    '<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(160, 174, 192, 0.2);"><span style="font-weight: 600;">$1:</span><span style="font-weight: 700;">$2</span></div>'
  );
  
  // Handle negative balance warnings
  const warningFormatted = formattedMessage.replace(
    /\*\*Негативный баланс:\*\*(.*?)(?=\s*\*\*|$)/g,
    '<div style="margin-top: 1rem; padding: 0.75rem; border-radius: 0.375rem; background-color: rgba(254, 202, 202, 0.3); color: rgb(185, 28, 28);"><span style="font-weight: 600; display: block; margin-bottom: 0.25rem;">Негативный баланс:</span><span style="display: block;">$1</span></div>'
  );
  
  // Same for English
  const finalFormatted = warningFormatted.replace(
    /\*\*Negative balance:\*\*(.*?)(?=\s*\*\*|$)/g,
    '<div style="margin-top: 1rem; padding: 0.75rem; border-radius: 0.375rem; background-color: rgba(254, 202, 202, 0.3); color: rgb(185, 28, 28);"><span style="font-weight: 600; display: block; margin-bottom: 0.25rem;">Negative balance:</span><span style="display: block;">$1</span></div>'
  );
  
  return finalFormatted;
};

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  locale
}) => {
  const t = translations[locale] || translations.en;
  const [message, setMessage] = useState('');
  const [view, setView] = useState<'current' | 'history'>('current');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  // Add state for resize functionality
  const [modalSize, setModalSize] = useState({ width: 800, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialPosRef = useRef({ x: 0, y: 0 });
  const initialSizeRef = useRef({ width: 0, height: 0 });
  
  // Add resize event handlers
  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (window.innerWidth < 768) return; // Don't resize on mobile
    
    setIsResizing(true);
    initialPosRef.current = { x: e.clientX, y: e.clientY };
    initialSizeRef.current = { width: modalSize.width, height: modalSize.height };
    
    document.body.style.userSelect = 'none'; // Prevent text selection during resize
  }, [modalSize]);
  
  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - initialPosRef.current.x;
    const deltaY = e.clientY - initialPosRef.current.y;
    
    setModalSize({
      width: Math.max(400, initialSizeRef.current.width + deltaX),
      height: Math.max(400, initialSizeRef.current.height + deltaY)
    });
  }, [isResizing]);
  
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = '';
  }, []);
  
  // Add event listeners
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, handleResize, handleResizeEnd]);
  
  const [conversations, setConversations] = useState<{
    data: Conversation[];
    loading: boolean;
    error?: string;
  }>({
    data: [],
    loading: false,
  });
  const [conversation, setConversation] = useState<{
    messages: ChatMessage[];
    contextId?: string;
    isLoading: boolean;
    error?: string;
  }>({
    messages: [],
    isLoading: false,
    contextId: undefined,
    error: undefined
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);
  
  // Load conversation history when modal opens
  useEffect(() => {
    if (isOpen && view === 'history' && conversations.data.length === 0) {
      fetchConversations();
    }
  }, [isOpen, view]);
  
  // Initialize conversation with welcome message or load selected conversation
  useEffect(() => {
    if (isOpen) {
      if (selectedConversationId) {
        fetchConversationDetail(selectedConversationId);
      } else if (conversation.messages.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          role: 'assistant',
          content: t.welcomeMessage,
          createdAt: new Date(),
        };
        setConversation(prev => ({
          ...prev,
          messages: [welcomeMessage]
        }));
      }
    }
  }, [isOpen, t.welcomeMessage, conversation.messages.length, selectedConversationId]);
  
  // Fetch conversation history
  const fetchConversations = async () => {
    setConversations(prev => ({ ...prev, loading: true, error: undefined }));
    try {
      const response = await aiAssistantApi.getConversations();
      
      // Check if response exists
      if (response) {
        // If response is an empty object or conversations is not in the expected format,
        // treat it as an empty conversations list rather than an error
        if (Object.keys(response).length === 0 || 
            !response.conversations || 
            !Array.isArray(response.conversations)) {
          setConversations({
            data: [],
            loading: false
          });
        } else {
          // Normal case - conversations array is present
          setConversations({
            data: response.conversations,
            loading: false
          });
        }
      } else {
        // Handle case when response doesn't have expected structure
        console.error('Invalid response format:', response);
        setConversations({
          data: [],
          loading: false,
          error: t.errorLoadingHistory
        });
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations({
        data: [],
        loading: false,
        error: t.errorLoadingHistory
      });
    }
  };
  
  // Fetch a single conversation detail
  const fetchConversationDetail = async (id: string) => {
    setConversation(prev => ({ ...prev, isLoading: true, error: undefined }));
    try {
      const response = await aiAssistantApi.getConversationDetail(id);
      
      // Check if response exists
      if (response) {
        // If response is an empty object or messages is not in the expected format,
        // treat it as an empty conversation rather than an error
        if (Object.keys(response).length === 0 || 
            !response.messages || 
            !Array.isArray(response.messages)) {
          setConversation({
            messages: [],
            isLoading: false,
            contextId: id,
            error: t.errorLoadingChat
          });
        } else {
          // Normal case - messages array is present
          setConversation({
            messages: response.messages,
            isLoading: false,
            contextId: id
          });
        }
      } else {
        // Handle case when response doesn't have expected structure
        console.error('Invalid conversation detail response:', response);
        setConversation({
          messages: [],
          isLoading: false,
          error: t.errorLoadingChat,
          contextId: id
        });
      }
    } catch (error) {
      console.error('Error fetching conversation detail:', error);
      setConversation({
        messages: [],
        isLoading: false,
        error: t.errorLoadingChat
      });
    }
  };
  
  // Format date based on locale
  const formatDate = (date: Date) => {
    return format(new Date(date), 'PPP', { 
      locale: locale === 'ru' ? ru : undefined 
    });
  };
  
  // Handler for conversation selection from history
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setView('current');
  };
  
  // Handler for starting a new conversation
  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setConversation({
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: t.welcomeMessage,
          createdAt: new Date(),
        }
      ],
      isLoading: false,
      contextId: undefined
    });
    setView('current');
  };
  
  // Helper function to render message content with proper formatting
  const renderMessageContent = (content: string) => {
    // Check if the content appears to be structured financial data (contains ### or **)
    if (content.includes('###') || content.includes('**')) {
      // Process financial data with HTML for better formatting
      return (
        <div 
          className="finance-data"
          style={financeStyles.financeData}
          dangerouslySetInnerHTML={{ __html: formatFinanceMessage(content) }}
        />
      );
    }
    
    // Use ReactMarkdown for regular messages with wrapper div for styling
    return (
      <div className="prose prose-sm dark:prose-invert">
        <ReactMarkdown
          components={{
            p: ({children}) => <p className="my-1">{children}</p>,
            ul: ({children}) => <ul className="list-disc pl-4 my-1">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal pl-4 my-1">{children}</ol>,
            li: ({children}) => <li className="my-0.5">{children}</li>,
            a: ({href, children}) => <a href={href} className="text-blue-600 hover:underline">{children}</a>
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !conversation.isLoading) {
      // Add user message to conversation
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: message,
        createdAt: new Date(),
      };
      
      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: undefined
      }));
      
      // Clear input
      setMessage('');
      
      try {
        // Send message to API
        const response = await aiAssistantApi.sendMessage({
          message: userMessage.content,
          contextId: conversation.contextId
        });
        
        // Check if response exists with the expected properties
        if (response && response.id && response.message && response.contextId) {
          // Add assistant response to conversation
          const assistantMessage: ChatMessage = {
            id: response.id,
            role: 'assistant',
            content: response.message,
            createdAt: new Date(),
          };
          
          setConversation(prev => ({
            ...prev,
            messages: [...prev.messages, assistantMessage],
            contextId: response.contextId,
            isLoading: false
          }));
          
          // Refresh conversation list if we're in history view
          if (view === 'history') {
            fetchConversations();
          }
        } else {
          // Handle case when response doesn't have expected structure
          console.error('Invalid sendMessage response:', response);
          setConversation(prev => ({
            ...prev,
            isLoading: false,
            error: t.error
          }));
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setConversation(prev => ({
          ...prev,
          isLoading: false,
          error: t.error
        }));
      }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Render the current chat view
  const renderCurrentChat = () => (
    <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
      <div className="bg-accent/50 dark:bg-accent/20 rounded-lg p-4 border border-border">
        <p className="text-foreground dark:text-foreground">
          {t.description}
        </p>
      </div>

      {/* Back to history button (when viewing a history conversation) */}
      {selectedConversationId && (
        <div>
          <Button variant="ghost" size="sm" onClick={() => { setView('history'); setSelectedConversationId(null); }}>
            <IoChevronBack className="mr-1" /> {t.backToHistory}
          </Button>
        </div>
      )}

      {/* Chat interface - make it fill available height */}
      <div className="flex-1 overflow-y-auto border dark:border-gray-700 rounded-lg p-4 bg-background dark:bg-background">
        <div className="flex flex-col space-y-4">
          {conversation.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start ${msg.role === 'assistant' ? '' : 'justify-end'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 mr-2">
                  <BiBrain className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1" />
                </div>
              )}
              <div 
                className={`rounded-lg p-3 max-w-[85%] ${
                  msg.role === 'assistant' 
                    ? 'bg-primary-100 dark:bg-primary-800/30 text-foreground dark:text-foreground shadow-md border border-primary/20' 
                    : 'bg-accent dark:bg-accent/30 text-foreground dark:text-foreground ml-auto shadow-md border border-border'
                }`}
              >
                {renderMessageContent(msg.content)}
                
                {/* Message timestamp */}
                <div className="text-right">
                  <span className="text-xs text-muted-foreground font-medium mt-1 inline-block">
                    {new Date(msg.createdAt).toLocaleTimeString(locale === 'ru' ? 'ru-RU' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {conversation.isLoading && (
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-2">
                <BiBrain className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1" />
              </div>
              <div className="bg-primary-100 dark:bg-primary-800/30 rounded-lg p-3 shadow-md border border-primary/20 max-w-[85%]">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse delay-300"></div>
                  <span className="ml-2 text-foreground dark:text-foreground font-medium">{t.loading}</span>
                </div>
              </div>
            </div>
          )}
          
          {conversation.error && (
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-2">
                <BiBrain className="w-6 h-6 text-destructive dark:text-destructive mt-1" />
              </div>
              <div className="bg-destructive/15 dark:bg-destructive/25 rounded-lg p-3 shadow-md border border-destructive/20 max-w-[85%]">
                <p className="text-destructive dark:text-destructive font-medium">{conversation.error}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex space-x-2 mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded-lg border border-input/80 dark:border-input/50 bg-background dark:bg-background px-4 py-2 text-foreground dark:text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder={t.inputPlaceholder}
          disabled={conversation.isLoading}
        />
        <Button 
          type="submit" 
          disabled={conversation.isLoading || !message.trim()}
        >
          {t.send}
        </Button>
      </form>
    </div>
  );
  
  // Render the conversation history view
  const renderHistoryView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{t.conversationHistory}</h3>
        <Button variant="outline" size="sm" onClick={handleNewConversation}>
          {t.newConversation}
        </Button>
      </div>
      
      {conversations.loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : conversations.error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
          {conversations.error}
        </div>
      ) : conversations.data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BiBrain className="w-12 h-12 mx-auto mb-2 text-primary-400 dark:text-primary-600" />
          <p>{t.noConversations}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {conversations.data.map((conv) => (
            <button
              key={conv.id}
              className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition duration-150 ease-in-out"
              onClick={() => handleSelectConversation(conv.id)}
            >
              <div className="font-medium mb-1">
                {conv.title || t.untitledConversation}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {formatDate(conv.createdAt)}
              </div>
              {conv.lastMessage && (
                <div className="text-sm line-clamp-2 text-gray-600 dark:text-gray-300">
                  {conv.lastMessage}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              width: window.innerWidth < 768 ? '100%' : `${modalSize.width}px`,
              height: window.innerWidth < 768 ? '100%' : `${modalSize.height}px`,
            }}
            className="fixed inset-0 md:inset-auto md:top-[10%] md:left-1/2 md:-translate-x-1/2 w-full h-[100dvh] md:h-auto md:w-auto md:max-w-[90vw] md:max-h-[80vh] bg-white dark:bg-gray-800 md:rounded-xl shadow-2xl overflow-hidden flex flex-col z-[60]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <BiBrain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-semibold text-foreground dark:text-foreground">
                  {t.title}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label={t.close}
              >
                <IoMdClose className="w-5 h-5" />
              </Button>
            </div>

            {/* Content with Tabs - update to fill available height */}
            <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 pt-4">
              <Tabs value={view} onValueChange={(value) => setView(value as 'current' | 'history')} className="flex-1 flex flex-col">
                <TabsList className="mb-4">
                  <TabsTrigger value="current">{t.currentChat}</TabsTrigger>
                  <TabsTrigger value="history">{t.history}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="current" className="flex-1 flex flex-col overflow-hidden">
                  {renderCurrentChat()}
                </TabsContent>
                
                <TabsContent value="history" className="flex-1 overflow-auto">
                  {renderHistoryView()}
                </TabsContent>
              </Tabs>
            </div>

            {/* Add resize handle */}
            <div 
              className="absolute bottom-0 right-0 w-6 h-6 md:flex hidden items-center justify-center cursor-se-resize z-50 text-muted-foreground hover:text-foreground"
              onMouseDown={handleResizeStart}
            >
              <IoResize className="w-4 h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 