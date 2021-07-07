import React, { useEffect, useState } from 'react';
import './ActionButton.styles.scss';
import Emitter from '../../services/emitter.service';
import { EmitterEvents } from '../../models/internal.interface';
import { ReadyState } from 'react-use-websocket';

interface ActionButtonProps {
  onClickEvent: (props?: any) => void;
  text: string;
  readyState: ReadyState;
  valid: boolean;
}

const ActionButton = ({
  onClickEvent,
  text,
  readyState,
  valid
}: ActionButtonProps): JSX.Element => {
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    Emitter.on(EmitterEvents.connectionClosed, () => {
      setClicked(false);
    });
    Emitter.on(EmitterEvents.networkSwap, () => {
      setClicked(false);
    });
    return () => {
      Emitter.off(EmitterEvents.connectionClosed);
      Emitter.off(EmitterEvents.networkSwap);
    };
  }, [clicked]);
  function handleClick() {
    if (clicked) {
      Emitter.emit(EmitterEvents.unsubscribe);
      setClicked(!clicked);
      return;
    }
    setClicked(!clicked);
    onClickEvent();
  }
  return (
    <button
      onClick={() => handleClick()}
      disabled={readyState !== ReadyState.OPEN || !valid}
      className={clicked ? 'action-btn action-btn__clicked' : 'action-btn'}>
      {clicked ? 'Cancel' : text}
    </button>
  );
};

export default ActionButton;
