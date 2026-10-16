import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { InventoryProvider } from './context/InventoryContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </HashRouter>
  </React.StrictMode>,
)
