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
import { GoalService } from './goal.service';
import { CreateGoalDto, UpdateGoalDto, GoalResponseDto } from './dto/goal.dto';
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

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new goal' })
  @ApiResponse({
    status: 201,
    description: 'Goal created successfully.',
    type: GoalResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiBody({ type: CreateGoalDto })
  create(
    @CurrentUser() userId: string,
    @Body() createGoalDto: CreateGoalDto,
  ): Promise<GoalResponseDto> {
    return this.goalService.create(userId, createGoalDto) as any;
  }

  @Get()
  @ApiOperation({ summary: 'Get all goals for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of goals.',
    type: [GoalResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() userId: string): Promise<GoalResponseDto[]> {
    return this.goalService.findAll(userId) as any;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific goal by ID' })
  @ApiResponse({
    status: 200,
    description: 'Goal details.',
    type: GoalResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Goal ID',
  })
  findOne(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GoalResponseDto> {
    return this.goalService.findOne(userId, id) as any;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific goal by ID' })
  @ApiResponse({
    status: 200,
    description: 'Goal updated successfully.',
    type: GoalResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Goal ID',
  })
  @ApiBody({ type: UpdateGoalDto })
  update(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ): Promise<GoalResponseDto> {
    return this.goalService.update(userId, id, updateGoalDto) as any;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific goal by ID' })
  @ApiResponse({ status: 204, description: 'Goal deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Goal ID',
  })
  async remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.goalService.remove(userId, id);
  }
}
