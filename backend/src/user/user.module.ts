import { Module } from '@nestjs/common';
import { UserService } from '../user.service'; // Correct path to user.service.ts
import { PrismaModule } from '../prisma/prisma.module'; // We need PrismaModule
// We don't need a UserController for this MVP as user interactions are via AuthController

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  exports: [UserService], // Export UserService to be used by other modules
})
export class UserModule {}
