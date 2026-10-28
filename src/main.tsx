import { queryClient } from '@/api/query.client'
import { applyTheme, readStoredTheme } from '@/utils/theme.utils'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// before the first render: the saved theme arrives from Rust asynchronously and would flash
applyTheme(readStoredTheme())

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
