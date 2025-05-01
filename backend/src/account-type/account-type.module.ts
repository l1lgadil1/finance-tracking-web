import { Module } from '@nestjs/common';
import { AccountTypeService } from './account-type.service';
import { AccountTypeController } from './account-type.controller';

@Module({
  providers: [AccountTypeService],
  controllers: [AccountTypeController],
  exports: [AccountTypeService],
})
export class AccountTypeModule {}
