import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './ErrorBoundary.jsx'

const rootEl = document.getElementById('root')

if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
  rootEl.innerHTML = `
    <div style="font-family:system-ui,-apple-system,sans-serif;padding:2rem;line-height:1.6;max-width:36rem;color:#111">
      <p style="margin:0 0 1rem;font-weight:700">This app must be loaded over HTTP, not as a file.</p>
      <p style="margin:0 0 1rem;color:#444">Opening <code>index.html</code> from Finder leaves the page blank because the browser blocks the module script.</p>
      <p style="margin:0">In the project folder run:</p>
      <pre style="background:#f3f4f6;padding:12px;border-radius:8px;overflow:auto">npm run dev</pre>
      <p style="margin:1rem 0 0">Then open the URL in the terminal (usually <code>http://localhost:5173</code>).</p>
    </div>`
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}
