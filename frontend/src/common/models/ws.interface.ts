import { TokensState } from '../../models/internal.interface';

export enum WsAction {
  subscribeToTokens = 'subscribe-to-tokens',
  lastBlock = 'last-block',
  tokenSymbols = 'token-symbols',
  unsubscribe = 'unsubscribe',
  swapDetails = 'swapDetails',
  success = 'success',
  info = 'info',
  error = 'error'
}

export interface TokenSymbolsPayload {
  tokenState: TokensState;
  wsUrl: string;
}

export interface LastBlockPayload {
  blockNumber: number;
}

export interface NotificationPayload {
  message: string;
}

export enum NodeAdresses {
  //dev
  // ethMainnet = 'wss://mainnet.infura.io/ws/v3/19e776b310ca4548bb1b63faaa42f93a',
  // ethRopsten = 'wss://ropsten.infura.io/ws/v3/19e776b310ca4548bb1b63faaa42f93a'
  // prod
  ethMainnet = 'ws://0.0.0.0:3334',
  ethRopsten = 'wss://ropsten.infura.io/ws/v3/157e8949dfa84e87a5ce1b468ec04617'
}

export enum Networks {
  ethMainnet = 'eth-mainnet',
  ethRopsten = 'eth-ropsten'
}

export interface WsEvent<T = any> {
  action: WsAction;
  payload?: T;
}

export interface SubscribeTokensPayload {
  wsUrl: string;
  tokens: SubscriptionTokensHashMap;
}

export interface SubscriptionTokensHashMap {
  [address: string]: string;
}

export interface SwapDetails {
  txHash: string;
  pair: string;
  etherSwapped: string;
  method: string;
  time: string;
  pairAddresses: string;
}
