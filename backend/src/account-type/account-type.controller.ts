import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AccountTypeService } from './account-type.service';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('account-types')
export class AccountTypeController {
  constructor(private readonly service: AccountTypeService) {}

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.findOne(userId, id);
  }

  @Post()
  create(@CurrentUser() userId: string, @Body() dto: CreateAccountTypeDto) {
    return this.service.create(userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountTypeDto,
  ) {
    return this.service.update(userId, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.softDelete(userId, id);
  }
}
