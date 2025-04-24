import { Module } from '@nestjs/common';
import { AiRequestLogService } from './ai-request-log.service';
import { AiRequestLogController } from './ai-request-log.controller';

@Module({
  controllers: [AiRequestLogController],
  providers: [AiRequestLogService],
  exports: [AiRequestLogService], // Export if needed
})
export class AiRequestLogModule {}
