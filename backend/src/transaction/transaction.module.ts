import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
// AccountModule might be needed if service logic expands to validate accounts more deeply
// import { AccountModule } from '../account/account.module';

@Module({
  // imports: [AccountModule], // Uncomment if AccountService is injected directly
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService], // Export if needed by other modules
})
export class TransactionModule {}
