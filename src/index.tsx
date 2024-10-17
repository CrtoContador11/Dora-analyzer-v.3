import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

console.log('index.tsx: Starting to render');

const root = document.getElementById('root');

if (root) {
  console.log('index.tsx: Root element found, rendering App');
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('index.tsx: Root element not found');
}

reportWebVitals();