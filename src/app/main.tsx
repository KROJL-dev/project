import ReactDOM from 'react-dom/client'

import { RouterProvider } from '@tanstack/react-router'

import { router } from './providers/router'
import { withReactQuery } from './providers/reactQuery'

import './styles/theme.css'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(withReactQuery(<RouterProvider router={router} />))
} else {
  console.error('Root element not found')
}
