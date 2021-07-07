import { TokensState } from '../models/internal.interface';
import { validateToken } from './ethers.service';

export enum TokensStorage {
  tokens = 'frontrun-tokens'
}

const getTokensFromStorage = (): TokensState => {
  const tokens = window.localStorage.getItem(TokensStorage.tokens);
  if (!tokens) {
    window.localStorage.setItem(TokensStorage.tokens, JSON.stringify({}));
    return {};
  }
  const parsedTokens = JSON.parse(tokens) as TokensState;
  return parsedTokens;
};

const saveTokensToStorage = (tokensState: TokensState): void => {
  let validTokens = true;
  Object.keys(tokensState).forEach((key) => {
    if (tokensState[key].address === '') {
      delete tokensState[key];
    }
    if (tokensState[key]?.address) {
      const isValid = validateToken(tokensState[key].address);
      if (!isValid) {
        validTokens = false;
      }
      if (
        !tokensState[key]?.minTrade ||
        tokensState[key].minTrade === '' ||
        +tokensState[key].minTrade < 0 ||
        isNaN(+tokensState[key].minTrade)
      ) {
        tokensState[key].minTrade = '1';
      }
    }
  });
  if (!validTokens) {
    return;
  }
  window.localStorage.setItem(TokensStorage.tokens, JSON.stringify(tokensState));
};

export default { getTokensFromStorage, saveTokensToStorage };
