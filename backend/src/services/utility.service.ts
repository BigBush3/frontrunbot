import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { Fragment } from 'ethers/lib/utils';
import { JsonFragment } from 'src/models/internal.interface';

@Injectable()
export class UtilityService {
  getProvider(wsUrl: string) {
    const provider = new ethers.providers.WebSocketProvider(wsUrl);
    return provider;
  }

  parseTransaction(
    txInputData: string,
    contractAbi: string | ReadonlyArray<Fragment | JsonFragment | string>,
  ) {
    const parser = new ethers.utils.Interface(contractAbi);
    const decodedTx = parser.parseTransaction({ data: txInputData });
    return decodedTx;
  }

  async getTokenSymbol(
    tokenAddress: string,
    provider: ethers.providers.WebSocketProvider,
  ): Promise<string> {
    const partialAbi = ['function symbol() view returns (string)'];
    const tokenContract = new ethers.Contract(
      tokenAddress,
      partialAbi,
      provider,
    );
    try {
      const symbol = await tokenContract.symbol();
      return symbol;
    } catch (error) {
      console.log('in that error');
      console.log(error);
      return 'smart contract error';
    }
  }
}
