import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * A guard that activates the JWT authentication strategy (`jwt`)
 * and protects routes requiring authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    // Add logging for debugging auth issues
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      this.logger.error('No JWT token found in request headers');
    } else {
      this.logger.debug('JWT token found, validating...');
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // If authentication failed, log the error and throw
    if (err || !user) {
      this.logger.error(
        `Authentication failed: ${err?.message || 'No user found'}`,
      );
      this.logger.debug('Auth info:', info);
      throw err || new UnauthorizedException('User not authenticated');
    }

    // Log successful authentication
    this.logger.debug(`User authenticated: ${user.id}`);
    return user;
  }
}
