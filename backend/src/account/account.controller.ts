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
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  UpdateAccountDto,
  AccountResponseDto,
} from './dto/account.dto';
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
import { Account as PrismaAccount } from '@prisma/client';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new account for the current user' })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully.',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiBody({ type: CreateAccountDto })
  async create(
    @CurrentUser() userId: string,
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    const account = await this.accountService.create(userId, createAccountDto);
    return this.mapToAccountResponseDto(account);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of accounts.',
    type: [AccountResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() userId: string): Promise<AccountResponseDto[]> {
    const accounts = await this.accountService.findAll(userId);
    return accounts.map(this.mapToAccountResponseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific account by ID' })
  @ApiResponse({
    status: 200,
    description: 'Account details.',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (access denied)' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Account ID',
  })
  async findOne(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AccountResponseDto> {
    const account = await this.accountService.findOne(userId, id);
    return this.mapToAccountResponseDto(account);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account name by ID' })
  @ApiResponse({
    status: 200,
    description: 'Account updated successfully.',
    type: AccountResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (access denied)' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation failed)' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Account ID',
  })
  @ApiBody({ type: UpdateAccountDto })
  async update(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    const account = await this.accountService.update(
      userId,
      id,
      updateAccountDto,
    );
    return this.mapToAccountResponseDto(account);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific account by ID' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (access denied)' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  // Potentially add 403 if deleting account with balance is forbidden
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Account ID',
  })
  async remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.accountService.remove(userId, id);
  }

  // Helper method to map Prisma Account to AccountResponseDto
  private mapToAccountResponseDto = (
    account: PrismaAccount,
  ): AccountResponseDto => ({
    id: account.id,
    name: account.name,
    userId: account.userId,
    createdAt: account.createdAt,
    balance: account.balance,
    accountTypeId: account.accountTypeId ?? null,
    accountTypeNameSnapshot: account.accountTypeNameSnapshot ?? undefined,
  });
}
