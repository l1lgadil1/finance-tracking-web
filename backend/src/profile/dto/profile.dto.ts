import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

// Manually defined Zod schema for Profile data handled by user
const ProfileDataSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  type: z.string().min(1, 'Type cannot be empty'), // Consider using z.enum() if types are predefined
});

// Schema for the full Profile entity response (including generated fields)
const ProfileResponseSchema = ProfileDataSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
});

// Schema for creating a profile (same as user-handled data)
const CreateProfileSchema = ProfileDataSchema;

// Schema for updating a profile (all fields optional)
const UpdateProfileSchema = ProfileDataSchema.partial();

// --- DTOs --- //

export class ProfileResponseDto extends createZodDto(ProfileResponseSchema) {}

export class CreateProfileDto extends createZodDto(CreateProfileSchema) {}

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
