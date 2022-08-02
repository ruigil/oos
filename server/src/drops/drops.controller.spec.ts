import { Test, TestingModule } from '@nestjs/testing';
import { DropsController } from './drops.controller';

describe('DropsController', () => {
  let controller: DropsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DropsController],
    }).compile();

    controller = module.get<DropsController>(DropsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
