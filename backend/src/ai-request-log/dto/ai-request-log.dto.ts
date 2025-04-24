import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

// Manually defined Zod schema for AIRequestLog data (mock)
const AiRequestLogDataSchema = z.object({
  prompt: z.string(),
  response: z.string(),
});

// Schema for the full AIRequestLog entity response
const AiRequestLogResponseSchema = AiRequestLogDataSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
});

// Schema for creating a log entry (no updates/deletes planned for MVP)
const CreateAiRequestLogSchema = AiRequestLogDataSchema;

// --- DTOs --- //

export class AiRequestLogResponseDto extends createZodDto(
  AiRequestLogResponseSchema,
) {}

export class CreateAiRequestLogDto extends createZodDto(
  CreateAiRequestLogSchema,
) {}

// No Update DTO needed for MVP
