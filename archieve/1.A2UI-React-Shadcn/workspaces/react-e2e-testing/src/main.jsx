import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeDefaultCatalog } from '@a2ui/react';
import App from './App.jsx';

initializeDefaultCatalog();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
