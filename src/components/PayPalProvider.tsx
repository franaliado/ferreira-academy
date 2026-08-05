'use client';

import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
        intent: 'capture',
        currency: 'USD',
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}