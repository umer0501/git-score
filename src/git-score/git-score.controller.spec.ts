import { Test, TestingModule } from '@nestjs/testing';
import { GitScoreController } from './git-score.controller';
import { GitScoreService } from './git-score.service';
import { GetReposDto } from './dtos/get-repos.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('GitScoreController', () => {
  let controller: GitScoreController;
  let service: GitScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GitScoreController],
      providers: [
        {
          provide: GitScoreService,
          useValue: {
            getRepositoriesScore: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GitScoreController>(GitScoreController);
    service = module.get<GitScoreService>(GitScoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return scored repositories with meta info', async () => {
    const mockResult = [
      {
        name: 'javascript-repo',
        url: 'https://github.com/username/javascript-repo',
        stars: 10,
        forks: 5,
        lastUpdated: '2025-01-01',
        score: 42,
      },
    ];
    jest.spyOn(service, 'getRepositoriesScore').mockResolvedValue(mockResult);

    const response = await controller.getRepositoriesScore({
      createdAfter: '2025-01-01',
      language: 'typescript',
    });

    expect(response.success).toBe(true);
    expect(response.meta.count).toBe(1);
    expect(response.data).toEqual(mockResult);
  });

  it('should fail validation if date and language not passed', async () => {
    const requestDTO = plainToInstance(GetReposDto, {});
    const errors = await validate(requestDTO);

    expect(errors.length).toBeGreaterThan(0);

    const createdAfterError = errors.find((e) => e.property === 'createdAfter');
    const languageError = errors.find((e) => e.property === 'language');

    expect(createdAfterError?.constraints).toHaveProperty(
      'isNotEmpty',
      'createdAfter is required',
    );

    expect(languageError?.constraints).toHaveProperty(
      'isString',
      'language must be a string',
    );
  });

  it('should fail validation if createdAfter has wrong date format', async () => {
    const requestDTO = plainToInstance(GetReposDto, {
      createdAfter: '21-09-2025',
    });

    const errors = await validate(requestDTO);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(
      'isDateString',
      'createdAfter must be a valid date format: YYYY-MM-DD',
    );
  });

  it('should fail validation if language is not a string', async () => {
    const requestDTO = plainToInstance(GetReposDto, {
      createdAfter: '2025-01-01',
      language: 123 as any,
    });
    const errors = await validate(requestDTO);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(
      'isString',
      'language must be a string',
    );
  });
});
