import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SubscriptionService } from './subscription.service';
import { TransactionService } from './transaction.service';
import { UtilityService } from './utility.service';

@Module({
  providers: [
    SubscriptionService,
    UtilityService,
    TransactionService,
    NotificationService,
  ],
  exports: [
    SubscriptionService,
    UtilityService,
    TransactionService,
    NotificationService,
  ],
})
export class ServicesModule {}
