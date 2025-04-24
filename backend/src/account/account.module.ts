import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService], // Export if needed by other modules (e.g., TransactionModule)
})
export class AccountModule {}
