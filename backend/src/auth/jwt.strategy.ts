import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user.service'; // Corrected path
import { JwtPayloadSchema } from './dto/auth.dto'; // Removed unused JwtPayloadDto import
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Get secret from config
    });
  }

  async validate(payload: unknown): Promise<Omit<User, 'password'>> {
    // Use Zod to safely parse and validate the payload shape
    const validationResult = JwtPayloadSchema.safeParse(payload);
    if (!validationResult.success) {
      console.error('Invalid JWT payload:', validationResult.error);
      throw new UnauthorizedException('Invalid token payload');
    }

    const { sub: userId } = validationResult.data;

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    // Passport attaches this return value to request.user
    return userWithoutPassword;
  }
}
