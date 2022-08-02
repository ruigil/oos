import { Test, TestingModule } from '@nestjs/testing';
import { DropsService } from './drops.service';

describe('DropsService', () => {
  let service: DropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DropsService],
    }).compile();

    service = module.get<DropsService>(DropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
