import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user.service'; // Corrected path
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  RegisterAuthDto,
  JwtPayloadDto,
  AuthResponseDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service'; // Corrected path
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto): Promise<AuthResponseDto> {
    const { email, password } = registerAuthDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    try {
      // Use Prisma transaction to ensure atomicity
      const user = await this.prisma.$transaction(async (tx) => {
        // 1. Create User
        const newUser = await this.userService.create({ email, password });

        // 2. Create Default Profile
        await tx.profile.create({
          data: {
            name: 'Личный',
            userId: newUser.id,
            type: 'personal',
            // Add other default profile settings if needed
          },
        });

        // 3. Create Default Account
        await tx.account.create({
          data: {
            name: 'Наличные',
            balance: 0,
            userId: newUser.id,
            // Add default currency, type, etc. if needed
          },
        });

        return newUser;
      });

      // Generate JWT
      return this.login(user);
    } catch (error) {
      // Handle potential transaction errors or other issues
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors if necessary
        if (error.code === 'P2002') {
          // Unique constraint violation
          throw new ConflictException('Email already registered');
        }
      }
      console.error('Registration failed:', error); // Log the error
      throw new InternalServerErrorException('Could not complete registration');
    }
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user; // Exclude password from result
      return result;
    }
    return null;
  }

  login(user: Omit<User, 'password'> | User): AuthResponseDto {
    if (!user || !('id' in user) || !('email' in user)) {
      throw new BadRequestException('Invalid user object provided to login');
    }
    const payload: JwtPayloadDto = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get user with password for comparison
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      throw new InternalServerErrorException('Failed to change password');
    }
  }
}
