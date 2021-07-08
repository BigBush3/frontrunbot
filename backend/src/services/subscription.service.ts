import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { SwapDetails, WsAction, WsEvent } from 'src/common/models/ws.interface';
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
    console.log('sub to tokens');
    console.log('tokens', tokens);
    const tokensAddresses = Object.keys(tokens).map((address) =>
      address.toLowerCase(),
    );
    provider.on('pending', async (txHash) => {
      // console.log('recievng data', txHash);
      const bigSwapTx = await this.transactionService.getBigSwapTx(
        txHash,
        provider,
        tokens,
        tokensAddresses,
      );
      if (bigSwapTx) {
        const swapDetails = await this.transactionService.assembleSwapDetails(
          bigSwapTx,
          provider,
        );
        const swapDetailsMsg: WsEvent<SwapDetails> = {
          action: WsAction.swapDetails,
          payload: swapDetails,
        };
        client.send(JSON.stringify(swapDetailsMsg));
      }
    });
  }

  subscribeToBlocks(
    provider: ethers.providers.WebSocketProvider,
    client: WebSocket,
  ) {
    console.log('sub to block');
    provider.on('block', (blockNumber) => {
      console.log('new block', blockNumber);
      this.utilityService.sendLastBlockMessage(blockNumber, client);
    });
  }
}
