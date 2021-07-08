import React, { useState } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import SettingsContainer from './SettingsContainer';
import './SettingsSection.styles.scss';

interface SettingsSectionProps {
  network: string;
  setNetwork: (network: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  setNodeAddress: (nodeAddress: string) => void;
  sendJsonMessage: SendJsonMessage;
  nodeAddress: string;
}

const SettingsSection = ({
  network,
  setNetwork,
  open,
  setOpen,
  setNodeAddress,
  sendJsonMessage,
  nodeAddress
}: SettingsSectionProps): JSX.Element => {
  return (
    <div className="settings-wrap">
      <button className="settings-btn" onClick={() => setOpen(!open)}>
        {open ? 'CLOSE' : 'OPEN'} SETTINGS
      </button>
      {
        <SettingsContainer
          sendJsonMessage={sendJsonMessage}
          setNodeAddress={setNodeAddress}
          nodeAddress={nodeAddress}
          network={network}
          setNetwork={setNetwork}
          open={open}
        />
      }
    </div>
  );
};

export default SettingsSection;
