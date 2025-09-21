import { Controller, Get, Query } from '@nestjs/common';
import { GitScoreService } from './git-score.service';
import { GetReposDto } from './dtos/get-repos.dto';
import { GetGithubRepoScoreResponse } from './types/get-github-repo-score-response.interface';

@Controller('git-score')
export class GitScoreController {
  constructor(private readonly gitScoreService: GitScoreService) {}

  @Get('repositories/score')
  async getRepositoriesScore(
    @Query() query: GetReposDto,
  ): Promise<GetGithubRepoScoreResponse> {
    const { createdAfter, language } = query;
    const results = await this.gitScoreService.getRepositoriesScore(
      createdAfter,
      language,
    );
    return {
      success: true,
      meta: {
        count: results.length,
        filters: { createdAfter, language },
      },
      data: results,
    };
  }
}
