import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvService } from '@app/common/config/env.config.service';

describe('AppController', () => {
  let appController: AppController;
  let service: AppService;
  let mockEnvService: Partial<EnvService>;
  beforeEach(async () => {
    mockEnvService = {};
    Object.defineProperty(mockEnvService, 'appConfig', {
      get: () => ({ host: 'localhost', apiPort: 3000 }),
    });
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: { getHello: jest.fn() },
        },
        {
          provide: EnvService,
          useValue: mockEnvService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    service = app.get(AppService);
  });
  it('should call getHello() service', () => {
    appController.getHello();
    expect(service.getHello).toHaveBeenCalled();
  });
});
