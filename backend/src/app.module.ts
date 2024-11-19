import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [ProgressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
