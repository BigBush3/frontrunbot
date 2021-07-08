import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import {
  LastBlockPayload,
  TokensStatePayload,
  WsAction,
  WsEvent,
} from '../common/models/ws.interface';
import { TokenDetails } from '../models/internal.interface';
import { TokensState } from '../common/models/ws.interface';

@Injectable()
export class UtilityService {
  getProvider(wsUrl: string) {
    const provider = new ethers.providers.WebSocketProvider(wsUrl);
    return provider;
  }

  async sendTokenStateMessage(tokenState: TokensState, client: WebSocket) {
    const tokenStateMsg: WsEvent<TokensStatePayload> = {
      action: WsAction.tokenSymbols,
      payload: {
        tokenState,
      },
    };
    client.send(JSON.stringify(tokenStateMsg));
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

  async addTokenSymbolsToState(
    wsUrl: string,
    tokenState: TokensState,
  ): Promise<TokensState> {
    const provider = this.getProvider(wsUrl);
    const newTokenState = { ...tokenState };
    const tokenPromiseArray = Object.keys(tokenState).map(async (tokenKey) => {
      const token = tokenState[tokenKey];
      const tokenDetails = await this.getTokenDetails(token.address, provider);
      newTokenState[tokenKey] = {
        ...newTokenState[tokenKey],
        symbol: tokenDetails.symbol,
      };
    });
    await Promise.all(tokenPromiseArray);
    return newTokenState;
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
