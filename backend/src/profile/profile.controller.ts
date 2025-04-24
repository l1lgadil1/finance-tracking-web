import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileResponseDto,
} from './dto/profile.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Profiles')
@ApiBearerAuth() // Indicate all routes in this controller require JWT
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new profile for the current user' })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully.',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiBody({ type: CreateProfileDto })
  create(
    @CurrentUser() userId: string,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.create(userId, createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all profiles for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of profiles.',
    type: [ProfileResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() userId: string): Promise<ProfileResponseDto[]> {
    return this.profileService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile details.',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Profile ID',
  })
  findOne(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string, // Validate ID is a UUID
  ): Promise<ProfileResponseDto> {
    return this.profileService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Profile ID',
  })
  @ApiBody({ type: UpdateProfileDto })
  update(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.update(userId, id, updateProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific profile by ID' })
  @ApiResponse({ status: 204, description: 'Profile deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Profile ID',
  })
  async remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    // Return void for 204 No Content
    await this.profileService.remove(userId, id);
  }
}
