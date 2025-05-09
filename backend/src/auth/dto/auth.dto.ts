import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// Schema for registration request body
const RegisterAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  // name: z.string().optional(), // Optional: Add name if needed during registration
});

// Schema for login request body
const LoginAuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Schema for profile update
const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
});

// Schema for the JWT payload
export const JwtPayloadSchema = z.object({
  sub: z.string().uuid(), // User ID (subject)
  email: z.string().email(),
  // Add other fields like roles if needed
});

// Schema for the response after successful login/registration
const AuthResponseSchema = z.object({
  accessToken: z.string(),
});

// Schema for change password
const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

// --- DTOs --- //

// DTO for registration request
export class RegisterAuthDto extends createZodDto(RegisterAuthSchema) {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (min 8 characters)',
    minLength: 8,
  })
  password: string;
}

// DTO for login request
export class LoginAuthDto extends createZodDto(LoginAuthSchema) {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  password: string;
}

// DTO for profile update
export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: '+1 (555) 123-4567',
    description: 'User phone number',
    required: false,
  })
  phone?: string;
}

// DTO for JWT payload (used internally and for strategy validation)
export class JwtPayloadDto extends createZodDto(JwtPayloadSchema) {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID (subject)',
  })
  sub: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;
}

// DTO for auth response
export class AuthResponseDto extends createZodDto(AuthResponseSchema) {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;
}

// DTO for change password
export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {
  @ApiProperty({
    example: 'currentPass123',
    description: 'Current user password',
  })
  currentPassword: string;

  @ApiProperty({
    example: 'newPass123',
    description: 'New password (min 8 characters)',
    minLength: 8,
  })
  newPassword: string;
}
