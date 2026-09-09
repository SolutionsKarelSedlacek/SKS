import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Diagnostic log to confirm mounting and base path at runtime
console.log('APP START', { base: import.meta.env.BASE_URL, pathname: location.pathname });

// Development-only admin page at /admin (respect BASE_URL)
const base = import.meta.env.BASE_URL || '/';
const adminPath = (base + 'admin').replace(/\/\/+/, '/');
if (import.meta.env.DEV && location.pathname.startsWith(adminPath)) {
  import('./Admin').then((m) => {
    const Admin = m.default;
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <Admin />
      </StrictMode>,
    );
  });
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
