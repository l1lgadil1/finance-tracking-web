import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

// Manually defined Zod schema for Category data handled by user
const CategoryDataSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  icon: z.string().optional(),
  categoryTypeId: z.string().uuid(),
});

// Schema for the full Category entity response
const CategoryResponseSchema = CategoryDataSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(), // userId is optional in schema.prisma
  categoryTypeNameSnapshot: z.string().optional(),
  categoryTypeId: z.string().uuid().nullable(), // allow null for response
  // Add other fields like createdAt/updatedAt if they exist in the model
});

// Schema for creating a category
const CreateCategorySchema = CategoryDataSchema;

// Schema for updating a category
const UpdateCategorySchema = CategoryDataSchema.partial();

// --- DTOs --- //

export class CategoryResponseDto extends createZodDto(CategoryResponseSchema) {}

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}

export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
