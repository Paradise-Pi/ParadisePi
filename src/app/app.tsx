import React from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import { MantineProvider } from '@mantine/core';
import Router from './router';


const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        // Override any other properties from default theme
        colorScheme: 'dark',
        primaryColor: 'dark',
      }}
      withGlobalStyles
    >
      <Router />
    </MantineProvider>
  </React.StrictMode>
);