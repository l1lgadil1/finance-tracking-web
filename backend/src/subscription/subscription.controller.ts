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
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionResponseDto,
} from './dto/subscription.dto';
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

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created.',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateSubscriptionDto })
  create(
    @CurrentUser() userId: string,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.create(
      userId,
      createSubscriptionDto,
    ) as any;
  }

  @Get('active')
  @ApiOperation({ summary: 'Get the active subscription for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Active subscription details.',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active subscription found' })
  async findActive(
    @CurrentUser() userId: string,
  ): Promise<SubscriptionResponseDto> {
    const subscription =
      await this.subscriptionService.findActiveForUser(userId);
    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }
    return subscription as any;
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of subscriptions.',
    type: [SubscriptionResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() userId: string): Promise<SubscriptionResponseDto[]> {
    return this.subscriptionService.findAll(userId) as any;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific subscription by ID' })
  @ApiResponse({
    status: 200,
    description: 'Subscription details.',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Subscription ID',
  })
  findOne(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.findOne(userId, id) as any;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific subscription by ID' })
  @ApiResponse({
    status: 200,
    description: 'Subscription updated.',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Subscription ID',
  })
  @ApiBody({ type: UpdateSubscriptionDto })
  update(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.update(
      userId,
      id,
      updateSubscriptionDto,
    ) as any;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific subscription by ID' })
  @ApiResponse({ status: 204, description: 'Subscription deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Subscription ID',
  })
  async remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.subscriptionService.remove(userId, id);
  }
}
