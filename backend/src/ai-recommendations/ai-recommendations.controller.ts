import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  AiRecommendationsService,
  AIRecommendation,
} from './ai-recommendations.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('AI Recommendations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-recommendations')
export class AiRecommendationsController {
  constructor(
    private readonly aiRecommendationsService: AiRecommendationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get AI recommendations for the current user' })
  @ApiResponse({
    status: 200,
    description: 'AI recommendations retrieved successfully.',
    type: 'object',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInsights(@CurrentUser() userId: string): Promise<AIRecommendation> {
    return this.aiRecommendationsService.getInsights(userId);
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate new AI recommendations' })
  @ApiResponse({
    status: 200,
    description: 'AI recommendations generated successfully.',
    type: 'object',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateInsights(
    @CurrentUser() userId: string,
  ): Promise<AIRecommendation> {
    return this.aiRecommendationsService.generateInsights(userId);
  }
}
