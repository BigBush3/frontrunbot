export enum WsAction {
  subscribeToTokens = 'subscribe-to-tokens',
  unsubscribe = 'unsubscribe'
}

export enum NodeAdresses {
  ethRopsten = 'wss://eth-ropsten.ws.alchemyapi.io/v2/6pTy9NyxsKH-8P8yA3HgiMdBmkilViYJ',
  ethMainnet = 'wss://eth-mainnet.ws.alchemyapi.io/v2/1rhRwSqT62V6PYgndNcawISXCvWSUsM5',
  reserveMainnet = 'wss://mainnet.infura.io/ws/v3/19e776b310ca4548bb1b63faaa42f93a',
  reserveRopsten = 'wss://ropsten.infura.io/ws/v3/19e776b310ca4548bb1b63faaa42f93a'
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
