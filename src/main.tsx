import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// react-snap pre-renders index.html at build time. If markup is already present, hydrate it.
if (root.hasChildNodes()) {
  hydrateRoot(root, tree)
} else {
  createRoot(root).render(tree)
}
