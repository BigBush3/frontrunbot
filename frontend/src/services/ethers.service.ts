import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { WsAction, WsEvent } from '../common/models/ws.interface';
import { TokensState } from '../models/internal.interface';
import { TokenSymbolsPayload } from '../common/models/ws.interface';

export const validateToken = (tokenAddress: string): boolean => {
  try {
    if (ethers.utils.isAddress(tokenAddress)) {
      return true;
    }
    if (tokenAddress !== '') {
      toast.error('Token address invalid');
    }
    return false;
  } catch (error) {
    if (tokenAddress !== '') {
      toast.error('Token address invalid');
    }
    return false;
  }
};

export const sendUnsubMessage = (sendJsonMessage: SendJsonMessage): void => {
  const unsubMsg: WsEvent = {
    action: WsAction.unsubscribe
  };
  sendJsonMessage(unsubMsg);
};

export const sendLastBlockMsg = (sendJsonMessage: SendJsonMessage, wsUrl: string): void => {
  const lastBlockMsg: WsEvent = {
    action: WsAction.lastBlock,
    payload: {
      wsUrl
    }
  };
  sendJsonMessage(lastBlockMsg);
};

export const sendTokenSymbolsMsg = (
  sendJsonMessage: SendJsonMessage,
  wsUrl: string,
  tokenState: TokensState
): void => {
  const tokenSymbolsMsg: WsEvent<TokenSymbolsPayload> = {
    action: WsAction.tokenSymbols,
    payload: {
      tokenState,
      wsUrl
    }
  };
  sendJsonMessage(tokenSymbolsMsg);
};
