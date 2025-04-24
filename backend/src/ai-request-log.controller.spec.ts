import { Test, TestingModule } from '@nestjs/testing';
import { AiRequestLogController } from './ai-request-log.controller';

describe('AiRequestLogController', () => {
  let controller: AiRequestLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiRequestLogController],
    }).compile();

    controller = module.get<AiRequestLogController>(AiRequestLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
