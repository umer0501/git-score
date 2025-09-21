import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SCORE_WEIGHTS } from 'src/constants/score-weights';
import { GitHubRepo } from './types/github-repo.interface';
import { GitHubScoredRepo } from './types/github-scored-repo.interface';

@Injectable()
export class GitScoreService {
  constructor(private readonly configService: ConfigService) {}

  async getRepositoriesScore(
    createdAfter?: string,
    language?: string,
  ): Promise<GitHubScoredRepo[]> {
    try {
      const queryParts: string[] = [];
      if (createdAfter) queryParts.push(`created:>${createdAfter}`);
      if (language) queryParts.push(`language:${language}`);
      const query = queryParts.join(' ');

      const baseUrl = this.configService.get<string>('GITHUB_API_URL');
      if (!baseUrl) {
        throw new Error('GITHUB_API_URL is not configured');
      }

      const url = `${baseUrl}?q=${encodeURIComponent(
        query,
      )}&sort=stars&order=desc&per_page=100`;

      const response = await axios.get(url);
      const repositoriesItems: GitHubRepo[] = response.data.items ?? [];

      return this.toGitHubRepoDto(repositoriesItems);
    } catch (err: any) {
      throw new HttpException(
        'Failed to fetch repositories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private toGitHubRepoDto(repos: GitHubRepo[]): GitHubScoredRepo[] {
    return repos.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      lastUpdated: repo.updated_at,
      score: this.computeScore(repo),
    }));
  }

  private computeScore(repo: GitHubRepo): number {
    const stars = repo.stargazers_count ?? 0;
    const forks = repo.forks_count ?? 0;

    const normalizedStars = Math.log1p(stars);
    const normalizedForks = Math.log1p(forks);

    const popularityScore =
      normalizedStars * SCORE_WEIGHTS.stars +
      normalizedForks * SCORE_WEIGHTS.forks;

    const updated = new Date(repo.updated_at).getTime();
    const ageInDays = (Date.now() - updated) / (1000 * 60 * 60 * 24);
    const recencyScore = 1 / (ageInDays + 1);

    const combinedScore =
      popularityScore * SCORE_WEIGHTS.popularity +
      recencyScore * SCORE_WEIGHTS.recency;

    return Math.round(combinedScore);
  }
}
