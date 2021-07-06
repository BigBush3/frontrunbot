import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { SubscriptionTokensHashMap } from 'src/models/internal.interface';
import { TransactionService } from './transaction.service';
import { UtilityService } from './utility.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private utilityService: UtilityService,
    private transactionService: TransactionService,
  ) {}
  subscribeToTokens(
    client: WebSocket,
    tokens: SubscriptionTokensHashMap,
    provider: ethers.providers.WebSocketProvider,
  ) {
    console.log('in service');
    console.log('tokens', tokens);
    const tokensAddresses = Object.keys(tokens).map((address) =>
      address.toLowerCase(),
    );
    provider.on('pending', (txHash) => {
      this.transactionService.checkTransaction(
        txHash,
        provider,
        tokens,
        tokensAddresses,
      );
    });
  }
}
