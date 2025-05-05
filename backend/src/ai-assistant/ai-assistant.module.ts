import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiAssistantController } from './ai-assistant.controller';
import { AiAssistantService } from './ai-assistant.service';
import { TransactionModule } from '../transaction/transaction.module';
import { AccountModule } from '../account/account.module';
import { GoalModule } from '../goal/goal.module';
import { CategoryModule } from '../category/category.module';
import { ProfileModule } from '../profile/profile.module';
import { AiRequestLogModule } from '../ai-request-log/ai-request-log.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    TransactionModule,
    AccountModule,
    GoalModule,
    CategoryModule,
    ProfileModule,
    AiRequestLogModule,
    ConfigModule,
  ],
  controllers: [AiAssistantController],
  providers: [AiAssistantService],
  exports: [AiAssistantService],
})
export class AiAssistantModule {}
