import React, { useEffect, useState } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import Emitter from '../../services/emitter.service';
import { EmitterEvents } from '../../models/internal.interface';
import { TokensState } from '../../models/internal.interface';
import { sendTokenSymbolsMsg } from '../../services/ethers.service';
import localStorageService from '../../services/localStorage.service';
import './TokenInputs.styles.scss';

interface TokenInputsProps {
  sendJsonMessage: SendJsonMessage;
  nodeAddress: string;
}

const TokenInputs = ({ sendJsonMessage, nodeAddress }: TokenInputsProps): JSX.Element => {
  const [tokensState, setTokensState] = useState({} as TokensState);
  const [allMinTrade, setAllMinTrade] = useState('');
  const inputCount = 33;

  useEffect(() => {
    const tokens = localStorageService.getTokensFromStorage();
    setTokensState(tokens);
  }, []);

  useEffect(function bindEventEmitters() {
    Emitter.on(EmitterEvents.tokenSymbols, (args) => {
      const newTokenState: TokensState = args[0];
      setTokensState(newTokenState);
      localStorageService.saveTokensToStorage(newTokenState);
    });
    return () => {
      Emitter.off(EmitterEvents.tokenSymbols);
    };
  }, []);

  function saveTokens(tokensStateDep?: TokensState) {
    if (tokensStateDep) {
      localStorageService.saveTokensToStorage(tokensStateDep);
    } else {
      localStorageService.saveTokensToStorage(tokensState);
    }
    const newTokens = localStorageService.getTokensFromStorage();
    setTokensState(newTokens);
    sendTokenSymbolsMsg(sendJsonMessage, nodeAddress, tokensStateDep || tokensState);
  }

  function setMinTrade() {
    const newTokenState: TokensState = {};
    Object.keys(tokensState).forEach((token) => {
      newTokenState[token] = { ...tokensState[token], minTrade: allMinTrade };
    });
    setTokensState(newTokenState);
    saveTokens(newTokenState);
  }

  return (
    <div className="token-wrap">
      <div className="token-wrap__header">Token inputs</div>
      <label style={{ display: 'flex', flexDirection: 'column' }} htmlFor="all-min-trade">
        Set min trade for all tokens in ether
        <div>
          <input
            value={allMinTrade}
            onChange={({ target }) => setAllMinTrade(target.value)}
            name="all-min-trade"
            id="all-min-trade"
            type="text"
          />
          <button
            disabled={nodeAddress.length === 0}
            className="save-tokens-btn__alt"
            onClick={setMinTrade}>
            Set
          </button>
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
                    minTrade: tokensState['token' + i]?.minTrade || '',
                    symbol: tokensState['token' + i]?.symbol || ''
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
                    address: tokensState['token' + i]?.address || '',
                    symbol: tokensState['token' + i]?.symbol || ''
                  }
                })
              }
              value={tokensState['token' + i]?.minTrade || ''}
              type="text"
              name={'min-trade' + i}
              id={'min-trade' + i}
            />
            {tokensState['token' + i]?.symbol || ''}
          </label>
        ))}
      <button
        disabled={nodeAddress.length === 0}
        onClick={() => saveTokens()}
        className="save-tokens-btn">
        Save
      </button>
    </div>
  );
};

export default TokenInputs;
