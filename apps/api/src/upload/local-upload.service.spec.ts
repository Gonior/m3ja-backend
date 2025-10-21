import { Test, TestingModule } from '@nestjs/testing';
import { LocalUploadService } from './local-upload.service';

describe('FileService', () => {
  let service: LocalUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalUploadService],
    }).compile();

    service = module.get<LocalUploadService>(LocalUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
