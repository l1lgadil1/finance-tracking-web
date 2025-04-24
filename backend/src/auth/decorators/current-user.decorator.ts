import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/client'; // Import User type for better checking

// Define a type for the expected user structure on the request
type RequestUser = Omit<User, 'password'>;

/**
 * Custom decorator to extract the user ID from the request object.
 * Assumes `JwtAuthGuard` and `JwtStrategy` have run and attached the user object.
 *
 * Example usage in a controller method:
 * ```
 * @UseGuards(JwtAuthGuard)
 * @Get('some-route')
 * findDataForUser(@CurrentUser() userId: string) {
 *   return this.someService.getData(userId);
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user: RequestUser | undefined = request.user; // Add type hint

    // Check if user object exists and has a string ID property
    if (!user || typeof user !== 'object' || typeof user.id !== 'string') {
      console.error(
        'CurrentUser decorator used without a valid user object (with string id) on request',
        user,
      );
      throw new InternalServerErrorException(
        'Could not retrieve valid user from request',
      );
    }

    return user.id; // Return the user ID string
  },
);
