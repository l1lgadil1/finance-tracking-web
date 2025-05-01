import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

// Manually defined Zod schema for Account data handled by user during creation/update
const AccountDataSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  // Balance is managed by transactions, but allow setting initial on create?
  // Let's allow setting initial balance on create, default to 0 otherwise.
  balance: z.number().optional().default(0),
  accountTypeId: z.string().uuid(),
});

// Schema for the full Account entity response
const AccountResponseSchema = AccountDataSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  balance: z.number(), // Ensure balance is always a number in response
  accountTypeNameSnapshot: z.string().optional(),
  accountTypeId: z.string().uuid().nullable(), // allow null for response
});

// Schema for creating an account
const CreateAccountSchema = AccountDataSchema;

// Schema for updating an account (only name is typically updatable directly)
const UpdateAccountSchema = AccountDataSchema.partial(); // Make name optional for PATCH

// --- DTOs --- //

export class AccountResponseDto extends createZodDto(AccountResponseSchema) {}

export class CreateAccountDto extends createZodDto(CreateAccountSchema) {}

export class UpdateAccountDto extends createZodDto(UpdateAccountSchema) {}
