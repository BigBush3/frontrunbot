import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from '../components/Dashboard/Dashboard';
import './App.styles.scss';

function App() {
  return (
    <div>
      <Dashboard />
      <ToastContainer pauseOnHover={false} />
    </div>
  );
}

export default App;
