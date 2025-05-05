import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiAssistantService } from './ai-assistant.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ConversationRequestDto,
  ConversationResponseDto,
  ReportRequestDto,
  ReportResponseDto,
  ConversationListResponseDto,
  ConversationDetailResponseDto,
} from './dto/ai-assistant.dto';

@ApiTags('AI Assistant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a message to the AI assistant' })
  @ApiResponse({
    status: 200,
    description: 'Message processed successfully',
    type: ConversationResponseDto,
  })
  async chat(
    @CurrentUser() userId: string,
    @Body() conversationRequest: ConversationRequestDto,
  ): Promise<ConversationResponseDto> {
    return this.aiAssistantService.processMessage(
      userId,
      conversationRequest.message,
      conversationRequest.contextId,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversation history' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
    type: ConversationListResponseDto,
  })
  async getConversations(
    @CurrentUser() userId: string,
  ): Promise<ConversationListResponseDto> {
    return this.aiAssistantService.getConversations(userId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation details with messages' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation details retrieved successfully',
    type: ConversationDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation not found',
  })
  async getConversationDetail(
    @CurrentUser() userId: string,
    @Param('id') conversationId: string,
  ): Promise<ConversationDetailResponseDto> {
    const conversation = await this.aiAssistantService.getConversationDetail(
      userId,
      conversationId,
    );

    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found`,
      );
    }

    return conversation;
  }

  @Post('reports')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a financial report' })
  @ApiResponse({
    status: 200,
    description: 'Report generated successfully',
    type: ReportResponseDto,
  })
  async generateReport(
    @CurrentUser() userId: string,
    @Body() reportRequest: ReportRequestDto,
  ): Promise<ReportResponseDto> {
    return this.aiAssistantService.generateReport(userId, reportRequest);
  }

  @Get('analyze/spending')
  @ApiOperation({ summary: 'Analyze spending patterns' })
  @ApiResponse({
    status: 200,
    description: 'Spending analysis successful',
    type: Object,
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  async analyzeSpending(
    @CurrentUser() userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    const reportRequest: ReportRequestDto = {
      type: 'MONTHLY_SPENDING',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      format: 'JSON',
    };

    const report = await this.aiAssistantService.generateReport(
      userId,
      reportRequest,
    );
    return report.data;
  }

  @Get('analyze/income-expenses')
  @ApiOperation({ summary: 'Analyze income vs expenses' })
  @ApiResponse({
    status: 200,
    description: 'Income vs expenses analysis successful',
    type: Object,
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  async analyzeIncomeVsExpenses(
    @CurrentUser() userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    const reportRequest: ReportRequestDto = {
      type: 'INCOME_VS_EXPENSES',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      format: 'JSON',
    };

    const report = await this.aiAssistantService.generateReport(
      userId,
      reportRequest,
    );
    return report.data;
  }

  @Get('analyze/goals')
  @ApiOperation({ summary: 'Analyze goal progress' })
  @ApiResponse({
    status: 200,
    description: 'Goal progress analysis successful',
    type: Object,
  })
  @ApiQuery({ name: 'goalIds', required: false, type: String, isArray: true })
  async analyzeGoalProgress(
    @CurrentUser() userId: string,
    @Query('goalIds') goalIds?: string[],
  ): Promise<any> {
    const reportRequest: ReportRequestDto = {
      type: 'GOAL_PROGRESS',
      goalIds,
      format: 'JSON',
    };

    const report = await this.aiAssistantService.generateReport(
      userId,
      reportRequest,
    );
    return report.data;
  }

  @Get('analyze/categories')
  @ApiOperation({ summary: 'Analyze category trends' })
  @ApiResponse({
    status: 200,
    description: 'Category trends analysis successful',
    type: Object,
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({
    name: 'categoryIds',
    required: false,
    type: String,
    isArray: true,
  })
  async analyzeCategoryTrends(
    @CurrentUser() userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryIds') categoryIds?: string[],
  ): Promise<any> {
    const reportRequest: ReportRequestDto = {
      type: 'CATEGORY_TRENDS',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      categoryIds,
      format: 'JSON',
    };

    const report = await this.aiAssistantService.generateReport(
      userId,
      reportRequest,
    );
    return report.data;
  }
}
