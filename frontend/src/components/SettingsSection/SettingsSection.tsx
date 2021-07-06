import React, { useState } from 'react';
import SettingsContainer from './SettingsContainer';
import './SettingsSection.styles.scss';

const SettingsSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="settings-wrap">
      <button className="settings-btn" onClick={() => setOpen(!open)}>
        {open ? 'CLOSE' : 'OPEN'} SETTINGS
      </button>
      {<SettingsContainer open={open} />}
    </div>
  );
};

export default SettingsSection;
