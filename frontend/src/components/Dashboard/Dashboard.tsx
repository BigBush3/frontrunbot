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
import MessagesSection from '../MessagesSection/MessagesSection';
import { sendLastBlockMsg, sendUnsubMessage } from '../../services/ethers.service';
import InfoSection from '../InfoSection/InfoSection';

const Dashboard = (): JSX.Element => {
  const socketUrl = 'ws://65.21.131.144:7080';
  const [connected, setConnected] = useState(true);
  const [lastBlock, setLastBlock] = useState('');
  const [nodeAddress, setNodeAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [open, setOpen] = useState(false);

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
      },
      onMessage: (msg) => {
        const message: WsEvent = JSON.parse(msg.data);
        switch (message.action) {
          case WsAction.swapDetails:
            Emitter.emit(EmitterEvents.tokenSwapDetails, [message.payload]);
            break;
          case WsAction.lastBlock:
            setLastBlock(message.payload.blockNumber);
            break;
          case WsAction.success:
            toast.success(message.payload.message);
            break;
          case WsAction.error:
            toast.error(message.payload.message);
            break;
          case WsAction.info:
            toast.info(message.payload.message);
            break;
          default:
            break;
        }
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
        sendLastBlockMsg(sendJsonMessage, nodeAddress);
      });

      // Emitter.on(EmitterEvents.networkSwap, (args) => {
      //   const swapDetails = args[0];
      //   console.log('received network event');
      //   setNodeAddress(swapDetails.nodeAddress);
      //   sendUnsubMessage();
      // });

      Emitter.on(EmitterEvents.unsubscribe, () => {
        sendUnsubMessage(sendJsonMessage);
      });

      return () => {
        Emitter.off(EmitterEvents.subscribeToTokens);
        Emitter.off(EmitterEvents.unsubscribe);
        // Emitter.off(EmitterEvents.networkSwap);
      };
    },
    [nodeAddress, network]
  );
  return (
    <div className="dashboard-wrap">
      <SettingsSection
        sendJsonMessage={sendJsonMessage}
        setNodeAddress={setNodeAddress}
        open={open}
        setOpen={setOpen}
        network={network}
        setNetwork={setNetwork}
      />
      <div className="row-wrap">
        <div>
          <ActionsSection nodeAddress={nodeAddress} readyState={readyState} />
          <InfoSection network={network} lastBlock={lastBlock} />
        </div>
        <MessagesSection />
      </div>
    </div>
  );
};

export default Dashboard;
