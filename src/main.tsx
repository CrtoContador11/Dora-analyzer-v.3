import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './AppWrapper'
import './index.css'

console.log('main.tsx is being executed');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppWrapper />
)