import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

// Define allowed transaction types
export const TransactionTypeEnum = z.enum([
  'income',
  'expense',
  'transfer',
  'debt_give', // Дали в долг
  'debt_take', // Взяли в долг
  'debt_repay', // Погашение долга (любого)
]);
export type TransactionType = z.infer<typeof TransactionTypeEnum>;

// Base schema for data common to most transactions
const TransactionBaseSchema = z.object({
  type: TransactionTypeEnum,
  amount: z.number().positive('Amount must be positive'),
  description: z.string().nullable(),
  date: z.coerce.date(), // Coerce string/number to Date
  profileId: z.string().uuid('Invalid Profile ID'),
  categoryId: z.string().uuid('Invalid Category ID').nullable(),
  accountId: z.string().uuid('Invalid Account ID').nullable(),
  fromAccountId: z
    .string()
    .uuid('Invalid From Account ID')
    .optional()
    .nullable(),
  toAccountId: z.string().uuid('Invalid To Account ID').optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  relatedDebtId: z
    .string()
    .uuid('Invalid Related Debt ID')
    .optional()
    .nullable(),
  // debtStatus is managed internally, not part of create/update DTO
});

// We can use .refine for complex cross-field validation, e.g., requiring accountId for income/expense
// or from/toAccountId for transfer. This will be enforced in the service logic as well.
const RefinedTransactionSchema = TransactionBaseSchema
  // Require accountId for income, expense, debt_give, debt_take, debt_repay
  .refine(
    (data) => {
      if (
        ['income', 'expense', 'debt_give', 'debt_take', 'debt_repay'].includes(
          data.type,
        )
      ) {
        return !!data.accountId;
      }
      return true;
    },
    {
      message: 'accountId is required for this transaction type',
      path: ['accountId'],
    },
  )
  // Require fromAccountId and toAccountId for transfer, and they must be different
  .refine(
    (data) => {
      if (data.type === 'transfer') {
        return (
          !!data.fromAccountId &&
          !!data.toAccountId &&
          data.fromAccountId !== data.toAccountId
        );
      }
      return true;
    },
    {
      message:
        'fromAccountId and toAccountId are required for transfer and must be different',
      path: ['fromAccountId', 'toAccountId'],
    },
  )
  // Require contactName and contactPhone for debt_give and debt_take
  .refine(
    (data) => {
      if (['debt_give', 'debt_take'].includes(data.type)) {
        return !!data.contactName && !!data.contactPhone;
      }
      return true;
    },
    {
      message:
        'contactName and contactPhone are required for debt transactions',
      path: ['contactName', 'contactPhone'],
    },
  );

// Schema for creating a transaction
// Note: Further specific validation (e.g., category type matching transaction type) might be needed in service.
const CreateTransactionSchema = RefinedTransactionSchema;

// Schema for updating a transaction (make fields optional)
// For MVP, let's disallow changing the type and critical IDs (account/from/to) after creation.
// Updates would mainly be for amount, description, date, category, contact.
const UpdateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  description: z.string().optional().nullable(), // Allow setting to null
  date: z.coerce.date().optional(),
  profileId: z.string().uuid('Invalid Profile ID').optional(), // Usually shouldn't change profile?
  categoryId: z.string().uuid('Invalid Category ID').optional().nullable(), // Allow unsetting category
  contactName: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
});

// --- DTOs --- //

// Full response DTO (adjust based on actual fields needed in response)
export class TransactionResponseDto extends createZodDto(
  TransactionBaseSchema.extend({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    createdAt: z.date(),
    debtStatus: z.string().optional(),
  }),
) {}

export class CreateTransactionDto extends createZodDto(
  CreateTransactionSchema,
) {}

export class UpdateTransactionDto extends createZodDto(
  UpdateTransactionSchema,
) {}

// DTO for query parameters when finding transactions
export const FindTransactionsQuerySchema = z
  .object({
    type: TransactionTypeEnum.optional(),
    profileId: z.string().uuid().optional(),
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    // Add pagination later: page: z.coerce.number().int().positive().optional().default(1),
    // Add pagination later: limit: z.coerce.number().int().positive().optional().default(10),
  })
  .partial(); // Make all query params optional

export class FindTransactionsQueryDto extends createZodDto(
  FindTransactionsQuerySchema,
) {}
