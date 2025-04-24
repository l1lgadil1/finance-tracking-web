import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto, LoginAuthDto, AuthResponseDto } from './dto/auth.dto';
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

@ApiTags('Auth')
@ApiExtraModels(RegisterAuthDto, LoginAuthDto, AuthResponseDto)
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
        email: { type: 'string', format: 'email' },
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
      email: user.email,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
