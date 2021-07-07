export interface TokensState {
  [token: string]: {
    address: string;
    minTrade: string;
  };
}

export enum EmitterEvents {
  unsubscribe = 'unsubscribe',
  subscribeToTokens = 'subscribeToTokens',
  networkSwap = 'networkSwap',
  connectionClosed = 'connectionClosed',
  tokenSwapDetails = 'tokenSwapDetails'
}
