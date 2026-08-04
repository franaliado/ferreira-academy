'use client';

import React from 'react';

/**
 * Ícono de Tarjeta Única (Gris Claro / Plata) con banda magnética oscura superior
 * y 3 logotipos sutiles (Visa, Mastercard, Discover/Amex) nítidamente integrados
 * en la parte inferior de la tarjeta, tal como en la referencia oficial (image_18.png).
 */
export const SingleCreditCardIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-auto' }) => (
  <svg className={`h-6 w-9 shrink-0 ${className}`} viewBox="0 0 44 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="silverCardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
    
    {/* Cuerpo de Tarjeta Gris Claro / Plata */}
    <rect x="0.5" y="0.5" width="43" height="27" rx="3.5" fill="url(#silverCardGradient)" stroke="#94A3B8" strokeWidth="0.8" />
    
    {/* Banda magnética oscura en la parte superior */}
    <rect y="3.5" width="44" height="5.5" fill="#1E293B" />
    
    {/* Tres micro logotipos nítidos en la parte inferior de la tarjeta */}
    {/* 1. Logo VISA (Fondo blanco con texto azul) */}
    <g transform="translate(3, 14.5)">
      <rect width="11" height="8" rx="1.2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
      <text x="5.5" y="5.8" fill="#1A1F71" fontSize="4.2" fontStyle="italic" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="-0.3">VISA</text>
    </g>
    
    {/* 2. Logo Mastercard (Fondo oscuro con círculos rojo y amarillo superpuestos) */}
    <g transform="translate(16.5, 14.5)">
      <rect width="11" height="8" rx="1.2" fill="#0F172A" />
      <circle cx="3.8" cy="4" r="2.5" fill="#EB001B" />
      <circle cx="7.2" cy="4" r="2.5" fill="#F79E1B" fillOpacity="0.9" />
      <path d="M5.5 2.1A2.47 2.47 0 0 1 6.5 4A2.47 2.47 0 0 1 5.5 5.9A2.47 2.47 0 0 1 4.5 4A2.47 2.47 0 0 1 5.5 2.1Z" fill="#FF5F00" />
    </g>
    
    {/* 3. Logo Discover / AMEX (Fondo azul con letras blancas) */}
    <g transform="translate(30, 14.5)">
      <rect width="11" height="8" rx="1.2" fill="#006FCF" />
      <text x="5.5" y="5.5" fill="#FFFFFF" fontSize="3.2" fontFamily="sans-serif" fontWeight="800" textAnchor="middle">DISC</text>
    </g>
  </svg>
);

/**
 * Insignia para "Tarjeta de Crédito o Débito" como UN SOLO elemento indivisible (Fondo gris claro/plata con logos nítidos).
 */
export const CreditCardBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-black/80 border border-white/20 shadow-md text-gray-200 hover:bg-neutral-900 hover:border-white/30 transition-all ${className}`}>
    <SingleCreditCardIcon />
    <span className="font-bold text-[13px] sm:text-[14.5px] tracking-tight text-white whitespace-nowrap">
      Tarjeta de Crédito o Débito
    </span>
  </div>
);

/**
 * Insignia de PayPal con logotipo vectorizado oficial.
 */
export const PayPalBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-black/80 border border-white/20 shadow-md hover:bg-neutral-900 hover:border-white/30 transition-all ${className}`}>
    <svg className="h-5 w-auto" viewBox="0 0 24 24" fill="none">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.762.762 0 0 1 .752-.642h6.843c2.617 0 4.673.666 5.617 1.8.847 1.018 1.018 2.453.498 4.195-.733 2.454-2.502 4.167-5.008 4.629-1.02.188-2.128.188-3.328.188H8.813a.641.641 0 0 0-.633.541l-1.104 6.906z" fill="#003087"/>
      <path d="M8.813 13.914h1.504c1.2 0 2.308 0 3.328-.188 2.506-.462 4.275-2.175 5.008-4.629.52-1.742.349-3.177-.498-4.195C17.21 3.778 15.154 3.112 12.537 3.112H5.696a.762.762 0 0 0-.752.642L1.837 20.597a.641.641 0 0 0 .633.74h4.606l1.104-6.882.633.541z" fill="#0079C1"/>
      <path d="M19.167 8.902c-.52 1.742-2.289 3.455-4.795 3.917-1.02.188-2.128.188-3.328.188H9.54a.641.641 0 0 0-.633.541l-1.393 8.718a.517.517 0 0 0 .51.597h3.702a.641.641 0 0 0 .633-.541l.926-5.795h1.104c2.506 0 4.275-1.713 5.008-4.167.52-1.742.349-3.177-.498-4.195a4.238 4.238 0 0 0-.727-.763z" fill="#00457C"/>
    </svg>
    <span className="font-black text-sm sm:text-base tracking-tight text-white">
      <span className="text-[#0079C1]">Pay</span>
      <span className="text-white">Pal</span>
    </span>
  </div>
);
