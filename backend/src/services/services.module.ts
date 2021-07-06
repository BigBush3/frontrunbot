import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { TransactionService } from './transaction.service';
import { UtilityService } from './utility.service';

@Module({
  providers: [SubscriptionService, UtilityService, TransactionService],
  exports: [SubscriptionService, UtilityService, TransactionService],
})
export class ServicesModule {}
