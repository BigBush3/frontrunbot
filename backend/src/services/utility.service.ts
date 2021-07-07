import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import {
  LastBlockPayload,
  WsAction,
  WsEvent,
} from 'src/common/models/ws.interface';
import { TokenDetails } from 'src/models/internal.interface';

@Injectable()
export class UtilityService {
  getProvider(wsUrl: string) {
    const provider = new ethers.providers.WebSocketProvider(wsUrl);
    return provider;
  }

  async sendLastBlockMessage(blockNumber: number, client: WebSocket) {
    const lastBlockMsg: WsEvent<LastBlockPayload> = {
      action: WsAction.lastBlock,
      payload: {
        blockNumber,
      },
    };
    client.send(JSON.stringify(lastBlockMsg));
  }

  async getLastBlock(provider: ethers.providers.WebSocketProvider) {
    const lastBlock = await provider.getBlockNumber();
    return lastBlock;
  }

  async getLastBlockFromUrl(wsUrl: string) {
    const provider = this.getProvider(wsUrl);
    const lastBlock = await provider.getBlockNumber();
    return lastBlock;
  }

  async getTokenDetails(
    tokenAddress: string,
    provider: ethers.providers.WebSocketProvider,
  ): Promise<TokenDetails> {
    const partialAbi = [
      'function symbol() view returns (string)',
      'function name() view returns (string)',
    ];
    const tokenContract = new ethers.Contract(
      tokenAddress,
      partialAbi,
      provider,
    );
    try {
      const symbol: string = await tokenContract.symbol();
      const name: string = await tokenContract.name();
      return { symbol, name };
    } catch (error) {
      return {
        name: 'SC error',
        symbol: 'SC error',
      };
    }
  }
}
