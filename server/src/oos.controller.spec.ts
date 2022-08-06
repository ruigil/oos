import { Test, TestingModule } from '@nestjs/testing';
import { OOSController } from './oos.controller';
import { OOSService } from './oos.service';

describe('AppController', () => {
  let appController: OOSController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OOSController],
      providers: [OOSService],
    }).compile();

    appController = app.get<OOSController>(OOSController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
