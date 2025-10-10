import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter> */}
        <App />
      {/* </BrowserRouter>
    </ClerkProvider> */}
  </StrictMode>,
)
