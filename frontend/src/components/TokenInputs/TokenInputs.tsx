import React, { useEffect, useState } from 'react';
import { TokensState } from '../../models/internal.interface';
import localStorageService from '../../services/localStorage.service';
import './TokenInputs.styles.scss';

const TokenInputs = () => {
  const [tokensState, setTokensState] = useState({} as TokensState);
  const inputCount = 33;

  useEffect(() => {
    const tokens = localStorageService.getTokensFromStorage();
    console.log('here');
    setTokensState(tokens);
  }, []);

  function saveTokens() {
    console.log('state', tokensState);
    localStorageService.saveTokensToStorage(tokensState);
  }

  return (
    <div className="token-wrap">
      <div className="token-wrap__header">Token inputs</div>
      {Array(inputCount)
        .fill('')
        .map((_, i) => (
          <label key={i} className="token-label" htmlFor={'token' + i}>
            Token {i + 1}
            <input
              className="token-input"
              onChange={({ target }) =>
                setTokensState({
                  ...tokensState,
                  ['token' + i]: {
                    address: target.value,
                    minTrade: tokensState['token' + i]?.minTrade || ''
                  }
                })
              }
              value={tokensState['token' + i]?.address}
              type="text"
              name={'token' + i}
              id={'token' + i}
            />
            <input
              className="min-trade-input"
              onChange={({ target }) =>
                setTokensState({
                  ...tokensState,
                  ['token' + i]: {
                    minTrade: target.value,
                    address: tokensState['token' + i]?.address || ''
                  }
                })
              }
              value={tokensState['token' + i]?.minTrade}
              type="text"
              name={'min-trade' + i}
              id={'min-trade' + i}
            />
          </label>
        ))}
      <button onClick={() => saveTokens()} className="save-tokens-btn">
        Save
      </button>
    </div>
  );
};

export default TokenInputs;
