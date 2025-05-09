import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  UnauthorizedException,
  Patch,
  BadRequestException,
  ConflictException,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterAuthDto,
  LoginAuthDto,
  AuthResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiExtraModels,
  ApiHeader,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { UserService } from '../user.service';
import * as JSZip from 'jszip';

@ApiTags('Auth')
@ApiExtraModels(
  RegisterAuthDto,
  LoginAuthDto,
  AuthResponseDto,
  ChangePasswordDto,
)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with the provided email and password.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: AuthResponseDto,
    schema: {
      $ref: getSchemaPath(AuthResponseDto),
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiResponse({ status: 409, description: 'Conflict (email already exists)' })
  @ApiBody({
    type: RegisterAuthDto,
    description: 'User registration credentials',
    schema: {
      $ref: getSchemaPath(RegisterAuthDto),
    },
  })
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in a user',
    description:
      'Authenticates a user with email and password and returns a JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: AuthResponseDto,
    schema: {
      $ref: getSchemaPath(AuthResponseDto),
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (invalid credentials)',
  })
  @ApiBody({
    type: LoginAuthDto,
    description: 'User login credentials',
    schema: {
      $ref: getSchemaPath(LoginAuthDto),
    },
  })
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(
      loginAuthDto.email,
      loginAuthDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieves the profile information for the currently authenticated user.',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT bearer token',
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Current user data.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        isPremium: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(
    @CurrentUser() userId: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found for token');
    }

    // Create a new object without the password property
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update current user profile',
    description:
      'Updates the profile information for the currently authenticated user.',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT bearer token',
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        isPremium: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: UpdateProfileDto })
  async updateProfile(
    @CurrentUser() userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found for token');
      }

      const updatedUser = await this.userService.update(
        userId,
        updateProfileDto,
      );

      // Create a new object without the password property
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isPremium: updatedUser.isPremium,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }

      console.error('Error updating profile:', error);
      throw new BadRequestException('Failed to update profile');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change user password',
    description: 'Changes the password for the currently authenticated user.',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT bearer token',
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid current password',
  })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @CurrentUser() userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('export-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Export user data',
    description: 'Exports all user data in CSV or JSON format',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT bearer token',
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Data exported successfully.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              description: 'Exported user data',
            },
          },
        },
      },
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
          description: 'CSV file with exported data',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async exportData(
    @CurrentUser() userId: string,
    @Body('format') format: 'json' | 'csv' = 'json',
    @Res() res: Response,
  ): Promise<void> {
    const exportData = await this.userService.exportUserData(userId, format);

    const filename = `aqsha_data_export_${new Date().toISOString().slice(0, 10)}`;

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}.json`,
      );
      res.send(exportData.data);
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}.csv`,
      );

      // Create a zip file with multiple CSV files
      const zip = new JSZip();

      // Add each entity type as a separate CSV file
      // Type assertion to help TypeScript understand the structure
      const csvData = exportData.data as {
        transactions: string;
        accounts: string;
        profiles: string;
        categories: string;
      };

      zip.file('transactions.csv', csvData.transactions || '');
      zip.file('accounts.csv', csvData.accounts || '');
      zip.file('profiles.csv', csvData.profiles || '');
      zip.file('categories.csv', csvData.categories || '');

      // Generate the zip file and send it as the response
      const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}.zip`,
      );
      res.send(zipContent);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user account',
    description: 'Permanently deletes the user account and all associated data',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT bearer token',
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccount(
    @CurrentUser() userId: string,
  ): Promise<{ success: boolean }> {
    await this.userService.deleteUser(userId);
    return { success: true };
  }
}
