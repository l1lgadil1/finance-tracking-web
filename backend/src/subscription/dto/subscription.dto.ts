import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

// Define allowed subscription statuses
const SubscriptionStatusEnum = z.enum(['active', 'trial', 'expired']);

// Manually defined Zod schema for Subscription data handled by user (mock)
const SubscriptionDataSchema = z.object({
  status: SubscriptionStatusEnum,
  plan: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
});

// Schema for the full Subscription entity response
const SubscriptionResponseSchema = SubscriptionDataSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  // Add other fields like createdAt/updatedAt if they exist
});

// Schema for creating a subscription (mock)
const CreateSubscriptionSchema = SubscriptionDataSchema;

// Schema for updating a subscription (mock)
const UpdateSubscriptionSchema = SubscriptionDataSchema.partial();

// --- DTOs --- //

export class SubscriptionResponseDto extends createZodDto(
  SubscriptionResponseSchema,
) {}

export class CreateSubscriptionDto extends createZodDto(
  CreateSubscriptionSchema,
) {}

export class UpdateSubscriptionDto extends createZodDto(
  UpdateSubscriptionSchema,
) {}
