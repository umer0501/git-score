import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestController } from './generate/nest/nest.controller';
import { GitScoreService } from './git-score/git-score.service';
import { GitScoreController } from './git-score/git-score.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController, NestController, GitScoreController],
  providers: [AppService, GitScoreService],
})
export class AppModule {}
