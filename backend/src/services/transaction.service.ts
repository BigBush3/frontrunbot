import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { Routers } from 'src/common/models/ws.interface';
import { uniswapV2abi } from 'src/lib/uniswapV2.abi';
import {
  SubscriptionTokensHashMap,
  TxMethods,
} from 'src/models/internal.interface';
import { UtilityService } from './utility.service';

@Injectable()
export class TransactionService {
  constructor(private utilityService: UtilityService) {}
  async checkTransaction(
    txHash: string,
    provider: ethers.providers.WebSocketProvider,
    tokenSubs: SubscriptionTokensHashMap,
    tokenAddresses: string[],
  ) {
    const tx = await provider.getTransaction(txHash);
    if (tx && tx?.to && tx?.to === Routers.uniswapV2) {
      const parsedTx = this.utilityService.parseTransaction(
        tx.data,
        uniswapV2abi,
      );
      if (parsedTx.name === TxMethods.swapExactETHForTokens) {
        const etherSwapped = ethers.utils.formatEther(tx.value);
        const tokenA = parsedTx.args.path[0];
        const tokenB = parsedTx.args.path[1];
        const tokenASybmbol = await this.utilityService.getTokenSymbol(
          tokenA,
          provider,
        );
        const tokenBSymbol = await this.utilityService.getTokenSymbol(
          tokenB,
          provider,
        );
        console.log('=================');
        console.log('SWAP TX');
        console.log(tx.hash);
        console.log(`PAIR ${tokenASybmbol}-${tokenBSymbol}`);
        console.log('Ether swapped:', etherSwapped);
        tokenAddresses.forEach((address) => {
          if (tokenB.toLowerCase() === address) {
            console.log('+++^^^NEEDED TOKEN^^^+++');
            console.log(
              'compare',
              +etherSwapped,
              +tokenSubs[tokenB.toLowerCase()],
            );
            if (+etherSwapped >= +tokenSubs[tokenB.toLowerCase()]) {
              console.log('***^^^^^^BIG SWAP^^^^^^***');
            }
          }
        });
      }
    }
  }
}
