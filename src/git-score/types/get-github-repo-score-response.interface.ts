import { GitHubScoredRepo } from "./github-scored-repo.interface";

export interface GetGithubRepoScoreResponse {
    success: boolean;
    meta: {
      count: number;
      filters: {
        createdAfter?: string;
        language?: string;
      };
    };
    data: GitHubScoredRepo[]; 
  }
  