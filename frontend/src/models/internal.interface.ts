export interface TokensState {
  [token: string]: {
    address: string;
    minTrade: string;
    symbol: string;
  };
}

export enum EmitterEvents {
  unsubscribe = 'unsubscribe',
  subscribeToTokens = 'subscribeToTokens',
  tokenSymbols = 'tokenSymbols',
  networkSwap = 'networkSwap',
  connectionClosed = 'connectionClosed',
  tokenSwapDetails = 'tokenSwapDetails'
}
