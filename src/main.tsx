import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('main.tsx: Starting to render')

const root = document.getElementById('root')

if (root) {
  console.log('main.tsx: Root element found, rendering App')
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error('main.tsx: Root element not found')
}