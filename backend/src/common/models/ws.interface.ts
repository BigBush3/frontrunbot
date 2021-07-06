export enum WsAction {
  subscribeToTokens = 'subscribe-to-tokens',
  unsubscribe = 'unsubscribe',
}

export enum NodeAdresses {
  ethRopsten = 'wss://eth-ropsten.ws.alchemyapi.io/v2/6pTy9NyxsKH-8P8yA3HgiMdBmkilViYJ',
  ethMainnet = 'wss://eth-mainnet.ws.alchemyapi.io/v2/1rhRwSqT62V6PYgndNcawISXCvWSUsM5',
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
