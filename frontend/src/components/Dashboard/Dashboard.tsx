import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './Dashboard.styles.scss';
import useWebSocket from 'react-use-websocket';
import SettingsSection from '../SettingsSection/SettingsSection';
import ActionsSection from '../ActionsSection/ActionsSection';
import {
  SubscribeTokensPayload,
  SubscriptionTokensHashMap,
  WsAction,
  WsEvent
} from '../../common/models/ws.interface';
import Emitter from '../../services/emitter.service';
import { EmitterEvents } from '../../models/internal.interface';
import localStorageService from '../../services/localStorage.service';

const Dashboard = () => {
  const socketUrl = 'ws://localhost:7080';
  const [connected, setConnected] = useState(true);
  const [nodeAddress, setNodeAddress] = useState('');

  const { sendJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => {
        toast.success('Connected to backend');
      },
      onClose: () => {
        if (connected) {
          setConnected(false);
          Emitter.emit(EmitterEvents.connectionClosed);
        }
        toast.error('Connection to backend closed');
      }
    },
    connected
  );

  useEffect(
    function reconnect() {
      setTimeout(() => {
        if (!connected) {
          setConnected(true);
          toast.info('Reconnecting to backend');
        }
      }, 3000);
    },
    [connected]
  );

  useEffect(
    function bindEventEmitters() {
      Emitter.on(EmitterEvents.subscribeToTokens, () => {
        const tokens = localStorageService.getTokensFromStorage();
        const tokensMapped: SubscriptionTokensHashMap = {};
        Object.values(tokens).forEach((v) => {
          tokensMapped[v.address.toLowerCase()] = v.minTrade;
        });
        const subMsg: WsEvent<SubscribeTokensPayload> = {
          action: WsAction.subscribeToTokens,
          payload: {
            wsUrl: nodeAddress,
            tokens: tokensMapped
          }
        };
        sendJsonMessage(subMsg);
      });

      Emitter.on(EmitterEvents.networkSwap, (args) => {
        const swapDetails = args[0];
        setNodeAddress(swapDetails.nodeAddress);
      });

      Emitter.on(EmitterEvents.unsubscribe, () => {
        const unsubMsg: WsEvent = {
          action: WsAction.unsubscribe
        };
        sendJsonMessage(unsubMsg);
      });

      return () => {
        Emitter.off(EmitterEvents.subscribeToTokens);
        Emitter.off(EmitterEvents.unsubscribe);
        Emitter.off(EmitterEvents.networkSwap);
      };
    },
    [nodeAddress]
  );
  return (
    <div className="dashboard-wrap">
      <SettingsSection />
      <ActionsSection nodeAddress={nodeAddress} readyState={readyState} />
    </div>
  );
};

export default Dashboard;
