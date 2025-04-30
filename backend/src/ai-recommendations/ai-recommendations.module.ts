import { Module } from '@nestjs/common';
import { AiRecommendationsService } from './ai-recommendations.service';
import { AiRecommendationsController } from './ai-recommendations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiRecommendationsController],
  providers: [AiRecommendationsService],
})
export class AiRecommendationsModule {}
