import React from 'react';
import './InfoSection.styles.scss';

interface InfoSectionProps {
  network: string;
  lastBlock: string;
}

const InfoSection = ({ network, lastBlock }: InfoSectionProps): JSX.Element => {
  return (
    <div className="info-section">
      <div className="info-section__header">Info</div>
      <div>
        <b>Network:</b> {network}
      </div>
      <div>
        <b>Last block:</b> {lastBlock}
      </div>
      {/* <div>
        <b>Wallet address:</b>
        <br />
        {wallet}
      </div>
      <div>
        <b>Balance:</b> {walletBalance} {blockchain === 'BSC' ? 'BNB' : 'ETH'}
      </div>
      <div>
        <b>Token balance:</b> {tokenBalance}
      </div>
      {tokenAddress.length > 0 && liquiditySymbolA.length > 0 && (
        <div>
          <b>Liquidity:</b> <br />
          {liquiditySymbolA}: {liquidityA} <br />
          {liquiditySymbolB}: {liquidityB}
        </div>
      )} */}
    </div>
  );
};

export default InfoSection;
