import React from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import NetworkSelection from '../NetworkSelection/NetworkSelection';
import TokenInputs from '../TokenInputs/TokenInputs';
import './SettingsContainer.styles.scss';

interface SettingsContainerProps {
  open: boolean;
  network: string;
  setNetwork: (network: string) => void;
  nodeAddress: string;
  setNodeAddress: (nodeAddress: string) => void;
  sendJsonMessage: SendJsonMessage;
}

const SettingsContainer = ({
  open,
  network,
  setNetwork,
  setNodeAddress,
  sendJsonMessage,
  nodeAddress
}: SettingsContainerProps): JSX.Element => {
  return (
    <div className={open ? 'settings-container' : 'settings-container settings-container__hidden'}>
      <TokenInputs nodeAddress={nodeAddress} sendJsonMessage={sendJsonMessage} />
      <NetworkSelection
        sendJsonMessage={sendJsonMessage}
        setNodeAddress={setNodeAddress}
        network={network}
        setNetwork={setNetwork}
      />
    </div>
  );
};

export default SettingsContainer;
