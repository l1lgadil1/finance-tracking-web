import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
