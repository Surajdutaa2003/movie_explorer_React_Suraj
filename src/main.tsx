// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RKDf4IS7GvTiu3zYWZzTGMJPwdUtnO0Q8kvI9YnfOL3bwBerxGsmvxSHXJf8TrMCqnqzJ0YDsCGjplq7X1UyQMD00RidEgjO9'); // Replace with your Stripe publishable key

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </StrictMode>,
);