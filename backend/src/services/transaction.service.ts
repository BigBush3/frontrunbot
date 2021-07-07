import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { Fragment } from 'ethers/lib/utils';
import { Routers, SwapDetails } from '../common/models/ws.interface';
import { uniswapV2abi } from '../lib/uniswapV2.abi';
import { JsonFragment } from '../models/internal.interface';
import {
  SubscriptionTokensHashMap,
  TxMethods,
} from '../models/internal.interface';
import { UtilityService } from './utility.service';

@Injectable()
export class TransactionService {
  constructor(private utilityService: UtilityService) {}
  parseTransaction(
    txInputData: string,
    contractAbi: string | ReadonlyArray<Fragment | JsonFragment | string>,
  ) {
    const parser = new ethers.utils.Interface(contractAbi);
    const decodedTx = parser.parseTransaction({ data: txInputData });
    return decodedTx;
  }

  async getBigSwapTx(
    txHash: string,
    provider: ethers.providers.WebSocketProvider,
    tokenSubs: SubscriptionTokensHashMap,
    tokenAddresses: string[],
  ): Promise<ethers.providers.TransactionResponse | undefined> {
    const tx = await provider.getTransaction(txHash);
    if (tx && tx?.to && tx?.to === Routers.uniswapV2) {
      const parsedTx = this.parseTransaction(tx.data, uniswapV2abi);
      if (parsedTx.name === TxMethods.swapExactETHForTokens) {
        const etherSwapped = ethers.utils.formatEther(tx.value);
        const tokenA = parsedTx.args.path[0];
        const tokenB = parsedTx.args.path[1];

        // remove in prod
        const tokenADetails = await this.utilityService.getTokenDetails(
          tokenA,
          provider,
        );
        const tokenBDetails = await this.utilityService.getTokenDetails(
          tokenB,
          provider,
        );
        console.log('=================');
        console.log('SWAP TX');
        console.log(tx.hash);
        console.log(`PAIR ${tokenADetails.symbol}-${tokenBDetails.symbol}`);
        console.log('Ether swapped:', etherSwapped);
        // remove

        for (const address of tokenAddresses) {
          if (tokenB.toLowerCase() === address) {
            // remove
            console.log('+++^^^NEEDED TOKEN^^^+++');
            console.log(
              'compare',
              +etherSwapped,
              +tokenSubs[tokenB.toLowerCase()],
            );
            // remove
            if (+etherSwapped >= +tokenSubs[tokenB.toLowerCase()]) {
              // console.log('***^^^^^^BIG SWAP^^^^^^***');
              return tx;
            }
          }
        }
        return undefined;
      }
      return undefined;
    }
    return undefined;
  }

  async assembleSwapDetails(
    tx: ethers.providers.TransactionResponse,
    provider: ethers.providers.WebSocketProvider,
  ): Promise<SwapDetails> {
    const parsedTx = this.parseTransaction(tx.data, uniswapV2abi);
    const tokenA = parsedTx.args.path[0];
    const tokenB = parsedTx.args.path[1];
    const pairAddresses = `${tokenA}-${tokenB}`;
    const etherSwapped = ethers.utils.formatEther(tx.value);
    const tokenADetails = await this.utilityService.getTokenDetails(
      tokenA,
      provider,
    );
    const tokenBDetails = await this.utilityService.getTokenDetails(
      tokenB,
      provider,
    );
    const pair = `${tokenADetails.name}(${tokenADetails.symbol})-${tokenBDetails.name}(${tokenBDetails.symbol})`;
    const swapDetails: SwapDetails = {
      txHash: tx.hash,
      time: new Date().toLocaleString(),
      pair,
      etherSwapped,
      method: parsedTx.name,
      pairAddresses,
    };
    return swapDetails;
  }
}
