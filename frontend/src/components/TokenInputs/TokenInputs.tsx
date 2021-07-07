import React, { useEffect, useState } from 'react';
import { TokensState } from '../../models/internal.interface';
import localStorageService from '../../services/localStorage.service';
import './TokenInputs.styles.scss';

const TokenInputs = (): JSX.Element => {
  const [tokensState, setTokensState] = useState({} as TokensState);
  const [allMinTrade, setAllMinTrade] = useState('');
  const inputCount = 33;

  useEffect(() => {
    const tokens = localStorageService.getTokensFromStorage();
    setTokensState(tokens);
  }, []);

  function saveTokens(tokensStateDep?: TokensState) {
    if (tokensStateDep) {
      localStorageService.saveTokensToStorage(tokensStateDep);
    } else {
      localStorageService.saveTokensToStorage(tokensState);
    }
    const newTokens = localStorageService.getTokensFromStorage();
    setTokensState(newTokens);
  }

  function setMinTrade() {
    const newTokenState: TokensState = {};
    Object.keys(tokensState).forEach((token) => {
      newTokenState[token] = { minTrade: allMinTrade, address: tokensState[token].address };
    });
    setTokensState(newTokenState);
    saveTokens(newTokenState);
  }

  return (
    <div className="token-wrap">
      <div className="token-wrap__header">Token inputs</div>
      <label style={{ display: 'flex', flexDirection: 'column' }} htmlFor="all-min-trade">
        Set min trade for all tokens
        <div>
          <input
            value={allMinTrade}
            onChange={({ target }) => setAllMinTrade(target.value)}
            name="all-min-trade"
            id="all-min-trade"
            type="text"
          />
          <button onClick={setMinTrade}>Set</button>
        </div>
      </label>
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
              value={tokensState['token' + i]?.minTrade || ''}
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
