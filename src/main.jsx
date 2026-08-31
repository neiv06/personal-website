import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NotFound from './NotFound.jsx'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
const currentPath = window.location.pathname.replace(/\/$/, '') || '/'
const Page = currentPath === basePath ? App : NotFound

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
