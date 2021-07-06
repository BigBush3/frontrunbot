import React from 'react';
import NetworkSelection from '../NetworkSelection/NetworkSelection';
import TokenInputs from '../TokenInputs/TokenInputs';
import './SettingsContainer.styles.scss';

interface SettingsContainerProps {
  open: boolean;
}

const SettingsContainer = ({ open }: SettingsContainerProps): JSX.Element => {
  return (
    <div className={open ? 'settings-container' : 'settings-container settings-container__hidden'}>
      <TokenInputs />
      <NetworkSelection />
    </div>
  );
};

export default SettingsContainer;
