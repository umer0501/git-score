import { Test, TestingModule } from '@nestjs/testing';
import { GitScoreService } from './git-score.service';

describe('GitScoreService', () => {
  let service: GitScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GitScoreService],
    }).compile();

    service = module.get<GitScoreService>(GitScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
