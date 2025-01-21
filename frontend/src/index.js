import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShopContextProvider from './Context/ShopContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
  <ShopContextProvider>
    <App />
  </ShopContextProvider>
  </StrictMode>
);

