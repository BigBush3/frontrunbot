import React, { useState } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { Networks, NodeAdresses } from '../../common/models/ws.interface';
import { EmitterEvents } from '../../models/internal.interface';
import Emitter from '../../services/emitter.service';
import { sendLastBlockMsg, sendUnsubMessage } from '../../services/ethers.service';
import './NetworkSelection.styles.scss';

interface NetworkSelectionProps {
  network: string;
  setNetwork: (network: string) => void;
  setNodeAddress: (nodeAddress: string) => void;
  sendJsonMessage: SendJsonMessage;
}

const NetworkSelection = ({
  network,
  setNetwork,
  setNodeAddress,
  sendJsonMessage
}: NetworkSelectionProps): JSX.Element => {
  function handleNetworkSwap(networkDep: Networks, nodeAddress: NodeAdresses) {
    Emitter.emit(EmitterEvents.networkSwap, [{ network: networkDep, nodeAddress }]);
    setNetwork(networkDep);
    setNodeAddress(nodeAddress);
    sendUnsubMessage(sendJsonMessage);
    sendLastBlockMsg(sendJsonMessage, nodeAddress);
  }

  return (
    <div className="network-section">
      <div className="network-section__header">Select network</div>
      <div className="network-radio">
        <label htmlFor="eth-mainnet">
          Ethereum Mainnet
          <input
            type="radio"
            checked={network === Networks.ethMainnet}
            value={NodeAdresses.ethMainnet}
            name="eth-mainnet"
            id="eth-mainnet"
            onChange={() => handleNetworkSwap(Networks.ethMainnet, NodeAdresses.ethMainnet)}
          />
        </label>
        <label htmlFor="eth-ropsten">
          Ethereum Ropsten
          <input
            type="radio"
            checked={network === Networks.ethRopsten}
            value={NodeAdresses.ethRopsten}
            name="eth-ropsten"
            id="eth-ropsten"
            onChange={() => handleNetworkSwap(Networks.ethRopsten, NodeAdresses.ethRopsten)}
          />
        </label>
      </div>
    </div>
  );
};

export default NetworkSelection;
