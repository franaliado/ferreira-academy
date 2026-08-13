'use client';

import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  const [clientId, setClientId] = useState<string>(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
  );

  useEffect(() => {
    if (!clientId) {
      fetch('/api/paypal/config')
        .then((res) => res.json())
        .then((data) => {
          if (data?.clientId) {
            setClientId(data.clientId);
          }
        })
        .catch((err) => console.error('Error al obtener PayPal Client ID:', err));
    }
  }, [clientId]);

  const activeClientId = clientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  if (!activeClientId) {
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: activeClientId,
        intent: 'capture',
        currency: 'USD',
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}