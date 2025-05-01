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
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponseDto,
  FindTransactionsQueryDto,
} from './dto/transaction.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully.',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (validation failed, invalid IDs)',
  })
  @ApiBody({ type: CreateTransactionDto })
  create(
    @CurrentUser() userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(userId, createTransactionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get transactions for the current user with filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions.',
    type: [TransactionResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: [
      'income',
      'expense',
      'transfer',
      'debt_give',
      'debt_take',
      'debt_repay',
    ],
  })
  @ApiQuery({
    name: 'profileId',
    required: false,
    type: String,
    format: 'uuid',
  })
  @ApiQuery({
    name: 'accountId',
    required: false,
    type: String,
    format: 'uuid',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    format: 'uuid',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: Date,
    description: 'ISO 8601 format',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: Date,
    description: 'ISO 8601 format',
  })
  findAll(
    @CurrentUser() userId: string,
    @Query() query: FindTransactionsQueryDto,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionService.findAll(userId, query);
  }

  @Get('active-debts')
  @ApiOperation({
    summary: 'Get active debt transactions for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active debt transactions.',
    type: [TransactionResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findActiveDebts(
    @CurrentUser() userId: string,
  ): Promise<TransactionResponseDto[]> {
    console.log('findActiveDebts called for userId', userId);
    return this.transactionService.findActiveDebts(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details.',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (access denied)' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Transaction ID',
  })
  findOne(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction by ID (limited fields)' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully.',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (access denied)' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Transaction ID',
  })
  @ApiBody({ type: UpdateTransactionDto })
  update(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiResponse({
    status: 204,
    description: 'Transaction deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (access denied)' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Transaction ID',
  })
  async remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.transactionService.remove(userId, id);
  }
}
