import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Elements } from '@stripe/react-stripe-js'
import stripePromise from './config/stripe.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </StrictMode>,
)
