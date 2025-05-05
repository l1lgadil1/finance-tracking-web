import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AiRequestLogService } from './ai-request-log.service';
import {
  CreateAiRequestLogDto,
  AiRequestLogResponseDto,
} from './dto/ai-request-log.dto';
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

@ApiTags('AI Request Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-request-logs') // Using kebab-case for endpoint
export class AiRequestLogController {
  constructor(private readonly aiRequestLogService: AiRequestLogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new AI request log entry' })
  @ApiResponse({
    status: 201,
    description: 'Log created successfully.',
    type: AiRequestLogResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateAiRequestLogDto })
  create(
    @CurrentUser() userId: string,
    @Body() createDto: CreateAiRequestLogDto,
  ): Promise<AiRequestLogResponseDto> {
    return this.aiRequestLogService.create(userId, createDto) as any;
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI request logs for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of logs.',
    type: [AiRequestLogResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() userId: string): Promise<AiRequestLogResponseDto[]> {
    return this.aiRequestLogService.findAll(userId) as any;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific AI request log by ID' })
  @ApiResponse({
    status: 200,
    description: 'Log details.',
    type: AiRequestLogResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Log not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Log ID',
  })
  findOne(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AiRequestLogResponseDto> {
    return this.aiRequestLogService.findOne(userId, id) as any;
  }

  // No update or delete endpoints for MVP
}
