import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { AccountModule } from './account/account.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { GoalModule } from './goal/goal.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AiRequestLogModule } from './ai-request-log/ai-request-log.module';
import { AiRecommendationsModule } from './ai-recommendations/ai-recommendations.module';
import { AccountTypeModule } from './account-type/account-type.module';
import { CategoryTypeModule } from './category-type/category-type.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ProfileModule,
    AccountModule,
    CategoryModule,
    TransactionModule,
    GoalModule,
    SubscriptionModule,
    AiRequestLogModule,
    AiRecommendationsModule,
    AccountTypeModule,
    CategoryTypeModule,
    AiAssistantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
