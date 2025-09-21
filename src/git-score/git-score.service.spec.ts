import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GitScoreService } from './git-score.service';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GitScoreService', () => {
  let service: GitScoreService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GitScoreService,
        {
          provide: ConfigService,
          useValue: {
            get: jest
              .fn()
              .mockReturnValue('https://api.github.com/search/repositories'),
          },
        },
      ],
    }).compile();

    service = module.get<GitScoreService>(GitScoreService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch repositories and compute scores', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            name: 'test-repo',
            html_url: 'https://github.com/test-repo',
            stargazers_count: 10,
            forks_count: 5,
            updated_at: new Date().toISOString(),
          },
        ],
      },
    });

    const result = await service.getRepositoriesScore(
      '2025-01-01',
      'typescript',
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('score');
    expect(result[0].name).toBe('test-repo');
  });

  it('should throw a proper error if GitHub API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(
      new HttpException(
        'Failed to fetch repositories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    await expect(
      service.getRepositoriesScore('2025-01-01', 'typescript'),
    ).rejects.toThrow('Failed to fetch repositories');
  });

  it('should return empty array if GitHub API returns no items', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { items: [] } });
  
    const result = await service.getRepositoriesScore('2025-01-01', 'typescript');
  
    expect(result).toEqual([]);
  });
});
