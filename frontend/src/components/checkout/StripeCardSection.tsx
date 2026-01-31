'use client';

import { CardElement } from '@stripe/react-stripe-js';
import { StripeCardElementOptions } from '@stripe/stripe-js';

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: '#171717',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#a3a3a3',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true, // We might want to collect this separately or let Stripe handle it if needed
};

export function StripeCardSection() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border border-neutral-300 bg-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14v-2h2v2h-2zm0-10h2v6h-2V6z" />
        </svg>
        <span>Your payment is secured by Stripe. We do not store your card details.</span>
      </div>
    </div>
  );
}
