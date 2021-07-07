import React, { useEffect, useRef, useState } from 'react';
import { SwapDetails } from '../../common/models/ws.interface';
import { EmitterEvents } from '../../models/internal.interface';
import Emitter from '../../services/emitter.service';
import './MessagesSection.styles.scss';

// Small element ref at the bottom of chat, so it automatically scrolls to bottom
// when new messages arrive
const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  // @ts-ignore
  useEffect(() => elementRef.current.scrollIntoView({ behavior: 'smooth' }));
  // @ts-ignore
  return <div ref={elementRef} />;
};

const MessagesSection = (): JSX.Element => {
  const [messages, setMessages] = useState([] as SwapDetails[]);

  useEffect(
    function bindEventEmitters() {
      Emitter.on(EmitterEvents.tokenSwapDetails, (args) => {
        const tokenSwapDetails: SwapDetails = args[0];
        setMessages([...messages, tokenSwapDetails]);
      });
    },
    [messages]
  );

  return (
    <div className="message-container">
      <div className="messages-header">Messages</div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div className="message" key={i + 'tx-details'}>
            <strong>TX hash:</strong> {msg.txHash} <br />
            At {msg.time} <br />
            <b>METHOD: {msg.method}</b> <br />
            Pair: <b>{msg.pair}</b>
            <br />
            Ether swapped: <b>{msg.etherSwapped}</b>
            <br />
            <b>Pair addresses:</b> <br /> {msg.pairAddresses}
          </div>
        ))}
        {/* {swapMessages.map((msg, i) => (
          <div key={i + 'tx-details'}>
            <b>Swap successfully</b>
            <br />
            At {msg.payload.swapTxTime} <br />
            <b>Liquidity tx block number: {msg.payload.liquidityTxBlock}</b> <br />
            <b>Swap tx block number: {msg.payload.swapTxBlock}</b> <br />
            <b>Liquidity tx hash: {msg.payload.liquidityTxHash}</b> <br />
            <b>Swap tx hash: {msg.payload.swapTxHash}</b> <br />
            =================================================================
            <br />
          </div>
        ))} */}
        <AlwaysScrollToBottom />
      </div>
    </div>
  );
};

export default MessagesSection;
