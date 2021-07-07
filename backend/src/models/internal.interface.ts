import { ethers } from 'ethers';

export interface SubscriptionTokensHashMap {
  [address: string]: string;
}

export enum TxMethods {
  swapExactETHForTokens = 'swapExactETHForTokens',
  swapETHForExactTokens = 'swapETHForExactTokens',
}

export interface TokenDetails {
  name: string;
  symbol: string;
}

export interface networkProviderMapping {
  [network: string]: ethers.providers.WebSocketProvider;
}

export interface JsonFragmentType {
  readonly name?: string;
  readonly indexed?: boolean;
  readonly type?: string;
  readonly internalType?: any; // @TODO: in v6 reduce type
  readonly components?: ReadonlyArray<JsonFragmentType>;
}

export interface JsonFragment {
  readonly name?: string;
  readonly type?: string;

  readonly anonymous?: boolean;

  readonly payable?: boolean;
  readonly constant?: boolean;
  readonly stateMutability?: string;

  readonly inputs?: ReadonlyArray<JsonFragmentType>;
  readonly outputs?: ReadonlyArray<JsonFragmentType>;

  readonly gas?: string;
}
