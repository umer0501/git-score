import { Test, TestingModule } from '@nestjs/testing';
import { GitScoreController } from './git-score.controller';

describe('GitScoreController', () => {
  let controller: GitScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GitScoreController],
    }).compile();

    controller = module.get<GitScoreController>(GitScoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
