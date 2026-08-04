'use client';

import React, { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';
import { currentCourse } from '@/data/currentCourse';
import {
  X,
  Lock,
  Sparkles,
} from 'lucide-react';



/** PayPal logo with original brand colors (vivid blue + white) */
const PayPalLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center text-lg font-black tracking-tight ${className}`}>
    <span className="text-[#0079C1]">Pay</span>
    <span className="text-white">Pal</span>
  </div>
);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const t = translations[currentLang].checkout;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
  });
// Payment method state removed; PayPal is the only option.
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize PayPal Smart Buttons when modal opens
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || !window.paypal) return;
    window.paypal
      .Buttons({
        createOrder: async () => {
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          return data.orderID;
        },
        onApprove: async (data, actions) => {
          await actions.order.capture();
          onClose();
          window.location.href =
            'https://chat.whatsapp.com/DYZZgiY5rm4Imls1wGIZzy?s=cl&p=a&ilr=1';
        },
        onError: (err) => {
          console.error(err);
          alert('Error al procesar el pago.');
        },
      })
      .render('#paypal-button-container');
  }, [isOpen, formData]);

  if (!isOpen) return null; // Payment handling moved to PayPal Smart Buttons; no custom submit handler required.

  const countriesList = [
    'España',
    'Estados Unidos',
    'México',
    'Colombia',
    'Argentina',
    'Chile',
    'Perú',
    'Brasil',
    'Ecuador',
    'República Dominicana',
    'Venezuela',
    'Francia',
    'Italia',
    'Reino Unido',
    'Otro País Internacional',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 pb-4 px-3 sm:px-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-950 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-[0_0_60px_rgba(212,175,55,0.25)] my-2">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-neutral-900 border border-amber-500/20 text-gray-400 hover:text-white hover:border-[#D4AF37] transition-all z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6 mt-2">
          <div className="flex justify-center items-center w-full">
            <img
              src="/Logo_Oficial_Negro.png"
              alt="Ferreira Academy"
              style={{ height: '140px', width: 'auto', maxWidth: '90%', marginBottom: '-16px' }}
              className="object-contain drop-shadow-[0_4px_24px_rgba(212,175,55,0.30)]"
            />
          </div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1 rounded-full text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.modalBadge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight">{t.title}</h2>
          <p className="text-[11px] sm:text-xs text-gray-400 font-light">{t.subtitle}</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* USER DATA */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-serif text-white border-b border-amber-500/20 pb-1.5">
              Tus Datos (1/2)
            </h3>
            
            <div className="space-y-0.5">
              <label className="block text-[11px] font-medium text-amber-200/80">{t.fullName} *</label>
              <input
                type="text"
                required
                placeholder="Ej. Antonio Ramírez Silva"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <label className="block text-[11px] font-medium text-amber-200/80">{t.email} *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-0.5">
                <label className="block text-[11px] font-medium text-amber-200/80">{t.phone} *</label>
                <input
                  type="tel"
                  required
                  placeholder="+34 600 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-0.5">
              <label className="block text-[11px] font-medium text-amber-200/80">{t.country} *</label>
              <select
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">{t.selectCountry}</option>
                {countriesList.map((c) => (
                  <option key={c} value={c} className="bg-neutral-950 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-serif text-white border-b border-amber-500/20 pb-1.5">
              Método de Pago (2/2)
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div id="paypal-button-container" className="w-full flex justify-center mt-4"></div>            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
