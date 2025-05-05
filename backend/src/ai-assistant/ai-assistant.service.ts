import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionService } from '../transaction/transaction.service';
import { AccountService } from '../account/account.service';
import { GoalService } from '../goal/goal.service';
import { CategoryService } from '../category/category.service';
import { AiRequestLogService } from '../ai-request-log/ai-request-log.service';
import OpenAI from 'openai';
import {
  ChatMessage,
  ReportRequestDto,
  ReportResponseDto,
} from './dto/ai-assistant.dto';
import { TransactionType } from '../shared/constants/finance';
import { v4 as uuidv4 } from 'uuid';
import { ChatCompletionMessageParam } from 'openai/resources';

// Interface for conversation context
interface ConversationContext {
  id: string;
  messages: ChatMessage[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define report data interfaces
interface MonthlySpendingReport {
  totalSpending: number;
  period: {
    start: Date;
    end: Date;
  };
  categories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

interface IncomeVsExpensesReport {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  period: {
    start: Date;
    end: Date;
  };
  monthly: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

interface CashFlowReport {
  totalAccounts: number;
  totalBalance: number;
  period: {
    start: Date;
    end: Date;
  };
  daily: Array<{
    date: string;
    income: number;
    expenses: number;
    transfers: number;
    netFlow: number;
  }>;
}

interface GoalProgressReport {
  goals: Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    remainingAmount: number;
    percentComplete: number;
    deadline: Date | null;
    daysRemaining: number;
    isOnTrack: boolean;
    requiredDailySaving: number;
    requiredMonthlySaving: number;
  }>;
  totalGoals: number;
  goalsOnTrack: number;
  goalsBehindSchedule: number;
}

interface CategoryTrendsReport {
  period: {
    start: Date;
    end: Date;
  };
  monthlyTrends: Array<{
    month: string;
    categories: Array<{
      categoryId: string;
      categoryName: string;
      amount: number;
    }>;
  }>;
  categoryTrends: Array<{
    name: string;
    data: Array<{
      month: string;
      amount: number;
    }>;
  }>;
}

// Combined report data type for accurate typing
type ReportData =
  | MonthlySpendingReport
  | IncomeVsExpensesReport
  | CashFlowReport
  | GoalProgressReport
  | CategoryTrendsReport;

@Injectable()
export class AiAssistantService {
  private readonly logger = new Logger(AiAssistantService.name);
  private readonly openai: OpenAI;
  private readonly conversations: Map<string, ConversationContext> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly goalService: GoalService,
    private readonly categoryService: CategoryService,
    private readonly aiRequestLogService: AiRequestLogService,
  ) {
    // Initialize OpenAI client with error handling
    try {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      if (!apiKey) {
        this.logger.error(
          'OpenAI API key is missing. AI features will not work correctly.',
        );
      }
      this.openai = new OpenAI({
        apiKey: apiKey || 'dummy-key-for-initialization',
      });
    } catch (error) {
      this.logger.error(
        `Failed to initialize OpenAI client: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // Create a dummy instance to prevent null reference exceptions
      this.openai = {} as OpenAI;
    }
  }

  /**
   * Process a user message and generate a response
   */
  async processMessage(
    userId: string,
    message: string,
    contextId?: string,
  ): Promise<{
    id: string;
    message: string;
    contextId: string;
    history?: ChatMessage[];
  }> {
    let conversation;
    let messages: ChatMessage[] = [];

    try {
      // Get or create conversation from database
      if (contextId) {
        // Try to find existing conversation
        conversation = await this.prisma.conversation.findUnique({
          where: { id: contextId },
          include: { messages: true },
        });

        // Verify this conversation belongs to the user
        if (conversation && conversation.userId !== userId) {
          this.logger.warn(
            `User ${userId} tried to access conversation ${contextId} that belongs to another user`,
          );
          conversation = null;
        }
      }

      // Create new conversation if needed
      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: {
            userId,
            title:
              message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          },
          include: { messages: true },
        });
      }

      // Convert database messages to ChatMessage format
      messages = conversation.messages.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: msg.createdAt,
      }));

      // Add user message to database
      const userMessage = await this.prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: message,
        },
      });

      // Add user message to memory for processing
      const userChatMessage: ChatMessage = {
        id: userMessage.id,
        role: 'user',
        content: message,
        createdAt: userMessage.createdAt,
      };
      messages.push(userChatMessage);

      // Generate user context for AI
      const userContext = await this.generateUserContext(userId);

      // Process with OpenAI
      const response = await this.generateAIResponse(messages, userContext);

      // Add assistant response to database
      const assistantMessage = await this.prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: response,
        },
      });

      // Update conversation title if it's the first message
      if (conversation.messages.length === 0) {
        await this.prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            title:
              message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          },
        });
      }

      // Add assistant message to memory for response
      const assistantChatMessage: ChatMessage = {
        id: assistantMessage.id,
        role: 'assistant',
        content: response,
        createdAt: assistantMessage.createdAt,
      };
      messages.push(assistantChatMessage);

      // Log the request
      await this.aiRequestLogService.create(userId, {
        prompt: message,
        response: response,
      });

      return {
        id: assistantMessage.id,
        message: response,
        contextId: conversation.id,
        history: messages,
      };
    } catch (error) {
      this.logger.error(
        `Error processing message: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Generate a financial report based on user data
   */
  async generateReport(
    userId: string,
    reportRequest: ReportRequestDto,
  ): Promise<ReportResponseDto> {
    const { type, startDate, endDate } = reportRequest;

    // Set default date range if not provided (last 30 days)
    const endDateTime = endDate ? new Date(endDate) : new Date();
    const startDateTime = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      startDateTime.setDate(startDateTime.getDate() - 30);
    }

    // Get relevant data based on report type
    let reportData: Record<string, any>;

    switch (type) {
      case 'MONTHLY_SPENDING':
        reportData = await this.generateMonthlySpendingReport(
          userId,
          startDateTime,
          endDateTime,
        );
        break;

      case 'INCOME_VS_EXPENSES':
        reportData = await this.generateIncomeVsExpensesReport(
          userId,
          startDateTime,
          endDateTime,
        );
        break;

      case 'CASH_FLOW':
        reportData = await this.generateCashFlowReport(
          userId,
          startDateTime,
          endDateTime,
        );
        break;

      case 'GOAL_PROGRESS':
        reportData = await this.generateGoalProgressReport(
          userId,
          reportRequest.goalIds,
        );
        break;

      case 'CATEGORY_TRENDS':
        reportData = await this.generateCategoryTrendsReport(
          userId,
          startDateTime,
          endDateTime,
          reportRequest.categoryIds,
        );
        break;

      default: {
        const reportTypeString = String(type);
        throw new NotFoundException(
          `Report type ${reportTypeString} not found`,
        );
      }
    }

    return {
      id: uuidv4(),
      type,
      data: reportData,
      generatedAt: new Date(),
      format: reportRequest.format,
    };
  }

  /**
   * Generate user context for AI responses
   */
  private async generateUserContext(userId: string): Promise<string> {
    try {
      // Get active accounts
      const accounts = await this.accountService.findAll(userId);

      // Get recent transactions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const transactions = await this.transactionService.findAll(userId, {
        dateFrom: thirtyDaysAgo,
        dateTo: new Date(),
      });

      // Get goals
      const goals = await this.goalService.findAll(userId);

      // Get categories
      const categories = await this.categoryService.findAll(userId);

      // Format context data
      return JSON.stringify({
        accounts: accounts.map((a) => ({
          id: a.id,
          name: a.name,
          balance: a.balance,
          accountType: a.accountTypeNameSnapshot,
        })),
        transactions: transactions.map((t) => ({
          id: t.id,
          amount: t.amount,
          type: t.type,
          categoryName: t.categoryId
            ? categories.find((c) => c.id === t.categoryId)?.name
            : null,
          date: t.date,
          description: t.description,
        })),
        goals: goals.map((g) => ({
          id: g.id,
          name: g.title,
          targetAmount: g.target,
          currentAmount: g.saved,
          deadline: g.deadline,
        })),
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          categoryType: c.categoryTypeNameSnapshot,
        })),
      });
    } catch (error) {
      this.logger.error(
        `Error generating user context: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return '{}';
    }
  }

  /**
   * Generate a response from OpenAI
   */
  private async generateAIResponse(
    messages: ChatMessage[],
    userContext: string,
  ): Promise<string> {
    try {
      // Create the system prompt with user context
      const systemPrompt = `
You are AqshaTracker AI, a personal finance assistant.
You help users make better financial decisions by analyzing their financial data, understanding context, and offering personalized advice.

USER CONTEXT (JSON):
${userContext}

Your capabilities include:
1. Analyzing spending patterns and income
2. Tracking financial goals and planning
3. Providing personalized advice
4. Generating financial reports
5. Detecting unusual patterns
6. Offering smart notifications

Keep your answers helpful, concise, and focused on the user's financial wellbeing.
If you don't have enough information to answer accurately, ask for more context or suggest what data would help.
      `;

      // Format conversation history for OpenAI
      const formattedMessages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(
          (msg) =>
            ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content,
            }) as ChatCompletionMessageParam,
        ),
      ];

      try {
        // Check if OpenAI client is properly initialized
        if (!this.openai.chat) {
          this.logger.error('OpenAI client is not properly initialized');
          return 'I apologize, but my AI service is currently unavailable. Please try again later or contact support.';
        }

        // Generate response with proper type handling
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1000,
        });

        if (!completion.choices?.length) {
          return 'I apologize, but I was unable to generate a response. Please try again later.';
        }

        return completion.choices[0].message.content || 'No response generated';
      } catch (e) {
        this.logger.error(
          `OpenAI API error: ${e instanceof Error ? e.message : 'Unknown error'}`,
        );
        return 'I apologize, but I encountered an error connecting to my knowledge base. Please try again later.';
      }
    } catch (error) {
      this.logger.error(
        `Error generating AI response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return 'I apologize, but I encountered an error processing your request. Please try again later.';
    }
  }

  /**
   * Generate Monthly Spending Report
   */
  private async generateMonthlySpendingReport(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MonthlySpendingReport> {
    const transactions = await this.transactionService.findAll(userId, {
      dateFrom: startDate,
      dateTo: endDate,
      type: TransactionType.EXPENSE,
    });

    // Group transactions by category
    const categoryMap = new Map<string, number>();

    for (const transaction of transactions) {
      const categoryName = transaction.categoryName || 'Uncategorized';
      const currentAmount = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentAmount + transaction.amount);
    }

    // Convert to array for sorting
    const categorySpending = Array.from(categoryMap.entries()).map(
      ([category, amount]) => ({
        category,
        amount,
        percentage:
          (amount / transactions.reduce((sum, t) => sum + t.amount, 0)) * 100,
      }),
    );

    // Sort by amount (descending)
    categorySpending.sort((a, b) => b.amount - a.amount);

    return {
      totalSpending: transactions.reduce((sum, t) => sum + t.amount, 0),
      period: {
        start: startDate,
        end: endDate,
      },
      categories: categorySpending,
    };
  }

  /**
   * Generate Income vs Expenses Report
   */
  private async generateIncomeVsExpensesReport(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IncomeVsExpensesReport> {
    // Get all transactions for the period
    const transactions = await this.transactionService.findAll(userId, {
      dateFrom: startDate,
      dateTo: endDate,
    });

    // Split into income and expenses
    const income = transactions.filter(
      (t) => t.type === TransactionType.INCOME,
    );
    const expenses = transactions.filter(
      (t) => t.type === TransactionType.EXPENSE,
    );

    // Calculate totals
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Group by month
    const monthlyData = new Map<string, { income: number; expenses: number }>();

    for (const transaction of transactions) {
      const monthKey = `${transaction.date.getFullYear()}-${(transaction.date.getMonth() + 1).toString().padStart(2, '0')}`;
      const current = monthlyData.get(monthKey) || { income: 0, expenses: 0 };

      if (transaction.type === TransactionType.INCOME) {
        current.income += transaction.amount;
      } else if (transaction.type === TransactionType.EXPENSE) {
        current.expenses += transaction.amount;
      }

      monthlyData.set(monthKey, current);
    }

    // Convert to sorted array
    const monthly = Array.from(monthlyData.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      savingsRate:
        totalIncome > 0
          ? ((totalIncome - totalExpenses) / totalIncome) * 100
          : 0,
      period: {
        start: startDate,
        end: endDate,
      },
      monthly,
    };
  }

  /**
   * Generate Cash Flow Report
   */
  private async generateCashFlowReport(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CashFlowReport> {
    // Get accounts
    const accounts = await this.accountService.findAll(userId);

    // Get all transactions for the period
    const transactions = await this.transactionService.findAll(userId, {
      dateFrom: startDate,
      dateTo: endDate,
    });

    // Group transactions by day
    const dailyTransactions = new Map<
      string,
      { income: number; expenses: number; transfers: number }
    >();

    for (const transaction of transactions) {
      const dateKey = transaction.date.toISOString().split('T')[0];
      const current = dailyTransactions.get(dateKey) || {
        income: 0,
        expenses: 0,
        transfers: 0,
      };

      if (transaction.type === TransactionType.INCOME) {
        current.income += transaction.amount;
      } else if (transaction.type === TransactionType.EXPENSE) {
        current.expenses += transaction.amount;
      } else if (transaction.type === TransactionType.TRANSFER) {
        current.transfers += transaction.amount;
      }

      dailyTransactions.set(dateKey, current);
    }

    // Convert to sorted array
    const daily = Array.from(dailyTransactions.entries())
      .map(([date, data]) => ({
        date,
        ...data,
        netFlow: data.income - data.expenses,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalAccounts: accounts.length,
      totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
      period: {
        start: startDate,
        end: endDate,
      },
      daily,
    };
  }

  /**
   * Generate Goal Progress Report
   */
  private async generateGoalProgressReport(
    userId: string,
    goalIds?: string[],
  ): Promise<GoalProgressReport> {
    // Get user goals
    let goals = await this.goalService.findAll(userId);

    // Filter by goalIds if provided
    if (goalIds && goalIds.length > 0) {
      goals = goals.filter((goal) => goalIds.includes(goal.id));
    }

    // Calculate progress for each goal
    const goalProgress = goals.map((goal) => {
      const percentComplete = (goal.saved / goal.target) * 100;

      // Calculate time-based metrics
      const now = new Date();
      const deadline = goal.deadline ? new Date(goal.deadline) : null;

      // Default values if no deadline
      let totalDays = 0;
      let daysRemaining = 0;
      let timeElapsedPercent = 100;
      let isOnTrack = true;

      if (deadline) {
        // We don't have access to goal.createdAt in the response
        // Using a default (30 days before now) if not available
        const created = new Date();
        created.setDate(created.getDate() - 30);

        totalDays = Math.ceil(
          (deadline.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
        );
        const daysElapsed = Math.ceil(
          (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
        );
        daysRemaining = Math.max(
          0,
          Math.ceil(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          ),
        );

        // Calculate if on track (percent of time elapsed vs percent of goal completed)
        timeElapsedPercent =
          totalDays > 0 ? (daysElapsed / totalDays) * 100 : 100;
        isOnTrack = percentComplete >= timeElapsedPercent;
      }

      // Calculate remaining amount
      const remainingAmount = goal.target - goal.saved;

      // Calculate required daily/monthly savings
      const requiredDailySaving =
        daysRemaining > 0 ? remainingAmount / daysRemaining : remainingAmount;
      const requiredMonthlySaving =
        daysRemaining > 0
          ? remainingAmount / (daysRemaining / 30)
          : remainingAmount;

      return {
        id: goal.id,
        name: goal.title,
        targetAmount: goal.target,
        currentAmount: goal.saved,
        remainingAmount,
        percentComplete,
        deadline: goal.deadline,
        daysRemaining,
        isOnTrack,
        requiredDailySaving,
        requiredMonthlySaving,
      };
    });

    return {
      goals: goalProgress,
      totalGoals: goalProgress.length,
      goalsOnTrack: goalProgress.filter((goal) => goal.isOnTrack).length,
      goalsBehindSchedule: goalProgress.filter((goal) => !goal.isOnTrack)
        .length,
    };
  }

  /**
   * Generate Category Trends Report
   */
  private async generateCategoryTrendsReport(
    userId: string,
    startDate: Date,
    endDate: Date,
    categoryIds?: string[],
  ): Promise<CategoryTrendsReport> {
    // Get transactions for the period
    const transactions = await this.transactionService.findAll(userId, {
      dateFrom: startDate,
      dateTo: endDate,
    });

    // Get categories
    const categories = await this.categoryService.findAll(userId);

    // Filter categories by categoryIds if provided
    const filteredCategories =
      categoryIds && categoryIds.length > 0
        ? categories.filter((cat) => categoryIds.includes(cat.id))
        : categories;

    // Create a map of category IDs to names
    const categoryMap = new Map(
      filteredCategories.map((cat) => [cat.id, cat.name]),
    );

    // Group transactions by month and category
    const monthlyData = new Map<string, Map<string, number>>();

    for (const transaction of transactions) {
      if (!transaction.categoryId) continue;

      // Skip if not in filtered categories
      if (
        categoryIds &&
        categoryIds.length > 0 &&
        !categoryIds.includes(transaction.categoryId)
      ) {
        continue;
      }

      const monthKey = `${transaction.date.getFullYear()}-${(transaction.date.getMonth() + 1).toString().padStart(2, '0')}`;

      // Initialize month if it doesn't exist
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, new Map<string, number>());
      }

      const categoryAmounts = monthlyData.get(monthKey);
      if (categoryAmounts) {
        const currentAmount = categoryAmounts.get(transaction.categoryId) || 0;
        categoryAmounts.set(
          transaction.categoryId,
          currentAmount + transaction.amount,
        );
      }
    }

    // Convert to a structured format
    const trends = Array.from(monthlyData.entries())
      .map(([month, categoryAmounts]) => {
        const categories = Array.from(categoryAmounts.entries()).map(
          ([categoryId, amount]) => ({
            categoryId,
            categoryName: categoryMap.get(categoryId) || 'Unknown',
            amount,
          }),
        );

        return {
          month,
          categories,
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate trend over time for each category
    const categoryTrends = new Map<
      string,
      { name: string; data: Array<{ month: string; amount: number }> }
    >();

    for (const monthData of trends) {
      for (const category of monthData.categories) {
        if (!categoryTrends.has(category.categoryId)) {
          categoryTrends.set(category.categoryId, {
            name: category.categoryName,
            data: [],
          });
        }

        const trend = categoryTrends.get(category.categoryId);
        if (trend) {
          trend.data.push({
            month: monthData.month,
            amount: category.amount,
          });
        }
      }
    }

    return {
      period: {
        start: startDate,
        end: endDate,
      },
      monthlyTrends: trends,
      categoryTrends: Array.from(categoryTrends.values()),
    };
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string): Promise<{
    conversations: Array<{
      id: string;
      title: string | null;
      createdAt: Date;
      updatedAt: Date;
      lastMessage?: string;
    }>;
    total: number;
  }> {
    try {
      // Get all conversations
      const conversations = await this.prisma.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      // Format the response
      const formattedConversations = conversations.map((conversation) => {
        // Get last message content if available
        const lastMessage =
          conversation.messages.length > 0
            ? conversation.messages[0].content
            : undefined;

        return {
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          lastMessage:
            lastMessage?.substring(0, 100) +
            (lastMessage && lastMessage.length > 100 ? '...' : ''),
        };
      });

      return {
        conversations: formattedConversations,
        total: formattedConversations.length,
      };
    } catch (error) {
      this.logger.error(
        `Error getting conversations: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /**
   * Get a single conversation with all messages
   */
  async getConversationDetail(
    userId: string,
    conversationId: string,
  ): Promise<{
    id: string;
    title: string | null;
    createdAt: Date;
    updatedAt: Date;
    messages: ChatMessage[];
  } | null> {
    try {
      // Get the conversation with all messages
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      // Check if conversation exists and belongs to user
      if (!conversation || conversation.userId !== userId) {
        return null;
      }

      // Format the messages
      const messages: ChatMessage[] = conversation.messages.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: msg.createdAt,
      }));

      return {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages,
      };
    } catch (error) {
      this.logger.error(
        `Error getting conversation detail: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
