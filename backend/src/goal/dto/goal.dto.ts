import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

// Manually defined Zod schema for Goal data handled by user
const GoalDataSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  target: z.number().positive('Target amount must be positive'),
  saved: z.number().nonnegative('Saved amount cannot be negative').default(0),
  deadline: z.coerce.date().optional().nullable(), // Allow null or date string
});

// Schema for the full Goal entity response
const GoalResponseSchema = GoalDataSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  // Add other fields like createdAt/updatedAt if they exist in the model
});

// Schema for creating a goal
const CreateGoalSchema = GoalDataSchema.omit({ saved: true }); // Don't allow setting saved amount on create

// Schema for updating a goal (all fields optional, except maybe target?)
// Let's allow updating title, target, deadline, saved.
const UpdateGoalSchema = GoalDataSchema.partial();

// --- DTOs --- //

export class GoalResponseDto extends createZodDto(GoalResponseSchema) {}

export class CreateGoalDto extends createZodDto(CreateGoalSchema) {}

export class UpdateGoalDto extends createZodDto(UpdateGoalSchema) {}
