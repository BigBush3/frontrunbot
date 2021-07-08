export interface TokensState {
  [token: string]: {
    address: string;
    minTrade: string;
    symbol: string;
  };
}

export interface TokensStatePayload {
  tokenState: TokensState;
}

export enum WsAction {
  subscribeToTokens = 'subscribe-to-tokens',
  lastBlock = 'last-block',
  tokenSymbols = 'token-symbols',
  unsubscribe = 'unsubscribe',
  swapDetails = 'swapDetails',
  success = 'success',
  info = 'info',
  error = 'error',
}

export interface TokenSymbolsPayload {
  tokenState: TokensState;
  wsUrl: string;
}

export interface NotificationPayload {
  message: string;
}

export interface LastBlockPayload {
  blockNumber: number;
}

export enum NodeAdresses {
  ethMainnet = 'wss://mainnet.infura.io/ws/v3/19e776b310ca4548bb1b63faaa42f93a',
  ethRopsten = 'wss://ropsten.infura.io/ws/v3/19e776b310ca4548bb1b63faaa42f93a',
}

export enum Routers {
  uniswapV2 = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
}

export interface WsEvent<T = any> {
  action: WsAction;
  payload?: T;
}

export interface SubscribeTokensPayload {
  wsUrl: string;
  tokens: { address: string; minTrade: string }[];
}

export interface SwapDetails {
  txHash: string;
  pair: string;
  etherSwapped: string;
  method: string;
  time: string;
  pairAddresses: string;
}
