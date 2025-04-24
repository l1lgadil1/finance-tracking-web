import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

// Define allowed category types
const CategoryTypeEnum = z.enum(['income', 'expense']);

// Manually defined Zod schema for Category data handled by user
const CategoryDataSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  icon: z.string().optional(),
  type: CategoryTypeEnum,
});

// Schema for the full Category entity response
const CategoryResponseSchema = CategoryDataSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(), // userId is optional in schema.prisma
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
