import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

// Base schema for conversation requests
const ConversationRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  contextId: z.string().uuid().optional(),
});

// Schema for conversation messages
const MessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  createdAt: z.date(),
});

// Schema for conversation responses
const ConversationResponseSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  contextId: z.string().uuid(),
  history: z.array(MessageSchema).optional(),
});

// Schema for conversation list item
const ConversationListItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastMessage: z.string().optional(),
});

// Schema for conversation list response
const ConversationListResponseSchema = z.object({
  conversations: z.array(ConversationListItemSchema),
  total: z.number(),
});

// Schema for conversation detail response
const ConversationDetailResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  messages: z.array(MessageSchema),
});

// Schema for generating reports
const ReportTypeSchema = z.enum([
  'MONTHLY_SPENDING',
  'INCOME_VS_EXPENSES',
  'CASH_FLOW',
  'GOAL_PROGRESS',
  'CATEGORY_TRENDS',
]);

const ReportRequestSchema = z.object({
  type: ReportTypeSchema,
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  goalIds: z.array(z.string().uuid()).optional(),
  profileIds: z.array(z.string().uuid()).optional(),
  format: z.enum(['JSON', 'CSV', 'PDF']).default('JSON'),
});

// Schema for the report response
const ReportResponseSchema = z.object({
  id: z.string().uuid(),
  type: ReportTypeSchema,
  data: z.record(z.any()),
  generatedAt: z.date(),
  format: z.enum(['JSON', 'CSV', 'PDF']),
  url: z.string().optional(),
});

// DTOs
export class ConversationRequestDto extends createZodDto(
  ConversationRequestSchema,
) {}
export class ConversationResponseDto extends createZodDto(
  ConversationResponseSchema,
) {}
export class MessageDto extends createZodDto(MessageSchema) {}
export class ReportRequestDto extends createZodDto(ReportRequestSchema) {}
export class ReportResponseDto extends createZodDto(ReportResponseSchema) {}
export class ConversationListResponseDto extends createZodDto(
  ConversationListResponseSchema,
) {}
export class ConversationDetailResponseDto extends createZodDto(
  ConversationDetailResponseSchema,
) {}

// Type for chat history
export type ChatMessage = z.infer<typeof MessageSchema>;
