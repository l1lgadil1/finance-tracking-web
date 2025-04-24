import { Test, TestingModule } from '@nestjs/testing';
import { AiRequestLogService } from './ai-request-log.service';

describe('AiRequestLogService', () => {
  let service: AiRequestLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiRequestLogService],
    }).compile();

    service = module.get<AiRequestLogService>(AiRequestLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
