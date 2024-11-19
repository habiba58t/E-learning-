import { Module } from '@nestjs/common';
import { UserInteractionsService } from './user-interactions.service';
import { UserInteractionsController } from './user-interactions.controller';
import { InteractionSchema } from './user-interaction.schema';
@Module({
  providers: [UserInteractionsService],
  controllers: [UserInteractionsController]
})
export class UserInteractionsModule {}
