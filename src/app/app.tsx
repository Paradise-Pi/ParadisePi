import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './index';
import './app.css';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);