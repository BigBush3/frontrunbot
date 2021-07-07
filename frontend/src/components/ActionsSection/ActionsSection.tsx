import React from 'react';
import ActionButton from '../ActionButton/ActionButton';
import Emitter from '../../services/emitter.service';
import './ActionsSection.styles.scss';
import { EmitterEvents } from '../../models/internal.interface';
import { ReadyState } from 'react-use-websocket';

interface ActionsSectionProps {
  readyState: ReadyState;
  nodeAddress: string;
}
const ActionsSection = ({ readyState, nodeAddress }: ActionsSectionProps): JSX.Element => {
  function subscribeToTokens() {
    Emitter.emit(EmitterEvents.subscribeToTokens);
  }

  function subIsValid(): boolean {
    return nodeAddress.length > 0;
  }
  return (
    <div className="actions-section">
      <div className="actions-section__header">Actions</div>
      <ActionButton
        readyState={readyState}
        valid={subIsValid()}
        onClickEvent={subscribeToTokens}
        text="Subscribe to tokens"
      />
    </div>
  );
};

export default ActionsSection;
