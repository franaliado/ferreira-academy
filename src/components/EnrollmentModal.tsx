'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { Language, translations } from '@/lib/translations';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { ShieldCheck, X, ChevronRight } from 'lucide-react';
import type { PaymentCaptureData } from '@/components/CertificateModal';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
  /** Called when a PayPal payment is captured with status COMPLETED */
  onPaymentCompleted?: (data: PaymentCaptureData) => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'es',
  onPaymentCompleted,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [step, setStep] = useState<'details' | 'checkout'>('details');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = (translations[currentLang] || translations.es).enrollmentModal;

  const includes = [
    { icon: '📜', label: t.includes.certificate },
    { icon: '☕', label: t.includes.coffeeBreak },
    { icon: '👑', label: t.includes.vipCommunity },
    { icon: '📚', label: t.includes.courseMaterial },
    { icon: '✂️', label: t.includes.inPersonTraining },
  ];

  // Close on ESC and trap focus
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      setStep('details');
      setErrorMessage(null);

      requestAnimationFrame(() => {
        closeBtnRef.current?.focus();
      });
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-course-title"
    >
      <style jsx global>{`
        @keyframes modalScaleIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-scale {
          animation: modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>

      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.15)] text-white overflow-hidden animate-modal-scale max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/5 border border-[#D4AF37]/20 text-gray-300 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] z-20"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* ── VISTA 1: DETALLES ── */}
        {step === 'details' && (
          <>
            <div className="flex flex-col items-center text-center mt-2 mb-0">
              <div className="relative w-40 sm:w-48 h-40 sm:h-48 -mb-10 overflow-visible">
                <Image
                  src="/Logo_Oficial_Negro.png"
                  alt="Ferreira Academy Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="z-10 relative mt-4 pt-0">
                <h2
                  id="modal-course-title"
                  className="text-lg sm:text-2xl font-black uppercase tracking-wider gold-gradient-text font-cinzel leading-tight bg-black px-2 py-0.5"
                >
                  {t.courseTitle}
                </h2>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400 mt-1 bg-black px-2 py-0.5 inline-block">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="mt-4"></div>

            <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-xl p-3 sm:p-4 space-y-2 mb-4 shadow-inner">
              <div className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">📅</span>
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none mb-0.5">
                    {t.officialDateLabel}
                  </p>
                  <p className="text-white font-bold">{t.officialDateValue}</p>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">📍</span>
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none mb-0.5">
                    {t.cityLabel}
                  </p>
                  <p className="text-white font-bold">{t.cityValue}</p>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="flex items-center space-x-3 text-xs sm:text-sm">
                <span className="text-base sm:text-lg">💰</span>
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none mb-0.5">
                    {t.officialPriceLabel}
                  </p>
                  <p className="text-[#D4AF37] font-black text-sm sm:text-base">
                    {t.officialPriceValue}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 space-y-1.5">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                {t.includesTitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {includes.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2.5 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-1.5"
                  >
                    <span className="text-sm sm:text-base">{item.icon}</span>
                    <span className="text-xs font-medium text-gray-200">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] sm:text-xs text-gray-400 text-center leading-normal mb-6 px-1 font-medium">
              {t.paymentNote}
            </p>

            <button
              onClick={() => setStep('checkout')}
              className="w-full group inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-[#D4AF37] via-[#f3e5ab] to-[#D4AF37] text-black font-black py-3.5 px-6 rounded-xl uppercase tracking-wider text-xs sm:text-sm shadow-lg hover:opacity-95 transition-all cursor-pointer"
            >
              <span>{t.proceedToCheckout}</span>
              <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}

        {/* ── VISTA 2: SEGUNDO MODAL (PAGO SEGURO) ── */}
        {step === 'checkout' && (
          <div className="py-2">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-4 mb-5">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Pago Seguro
              </h3>
            </div>

            <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Plan Seleccionado
                </p>
                <p className="text-white font-bold text-sm sm:text-base">
                  Fade Mastery Elite (Presencial)
                </p>
              </div>
              <div className="text-right">
                <span className="text-[#D4AF37] font-black text-lg sm:text-xl">
                  95.00 USD
                </span>
              </div>
            </div>

            <p className="text-xs font-medium text-gray-300 mb-3 uppercase tracking-wider">
              Método de Pago (PayPal Oficial)
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/40 rounded-xl text-center text-xs font-bold text-rose-400">
                {errorMessage}
              </div>
            )}

            <div className="w-full mb-4">
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'gold',
                  shape: 'rect',
                  label: 'pay',
                }}
                createOrder={async () => {
                  try {
                    const res = await fetch('/api/paypal/create-order', {
                      method: 'POST',
                    });
                    const data = await res.json();
                    if (!res.ok || !data.id) {
                      throw new Error(data.error || 'No se pudo generar la orden de PayPal');
                    }
                    return data.id;
                  } catch (err) {
                    console.error('Error al crear orden:', err);
                    setErrorMessage('Ocurrió un error al conectar con PayPal.');
                    throw err;
                  }
                }}
                onApprove={async (data) => {
                  try {
                    const res = await fetch('/api/paypal/capture-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ orderID: data.orderID }),
                    });
                    const details = await res.json() as {
                      status?: string;
                      orderID?: string;
                      captureID?: string;
                      payerEmail?: string;
                      payerName?: string;
                      payerPhone?: string | null;
                      payerCountry?: string;
                      amount?: string;
                      currency?: string;
                      payerID?: string;
                      fundingSource?: string;
                      error?: string;
                    };
                    if (!res.ok) {
                      throw new Error(details.error || 'Error al capturar el pago');
                    }
                    if (details.status === 'COMPLETED') {
                      // Detect payment method: PayPal account vs card
                      // data.paymentSource is the most reliable signal from the SDK
                      const paymentSource = (data as unknown as Record<string, unknown>).paymentSource as string | undefined;
                      const fundingSource = details.fundingSource || '';
                      const isCard =
                        typeof paymentSource === 'string'
                          ? paymentSource === 'card'
                          : fundingSource === 'card' || fundingSource === 'credit_card' || fundingSource === 'debit_card';

                      const captureData: PaymentCaptureData = {
                        orderID: details.orderID || data.orderID,
                        captureID: details.captureID,
                        payerName: details.payerName || '',
                        payerEmail: details.payerEmail || '',
                        payerPhone: details.payerPhone || null,
                        payerCountry: details.payerCountry || 'N/A',
                        paymentMethod: isCard ? 'card' : 'paypal',
                        amount: details.amount || '95.00',
                        currency: details.currency || 'USD',
                        payerID: details.payerID || data.payerID || '',
                      };

                      // Close checkout modal first, then open certificate modal
                      onClose();
                      if (onPaymentCompleted) {
                        onPaymentCompleted(captureData);
                      }
                    } else {
                      throw new Error('El pago no fue completado correctamente.');
                    }
                  } catch (err) {
                    console.error('Error al capturar pago:', err);
                    setErrorMessage('Error al procesar la aprobación del pago.');
                  }
                }}
                onError={(err) => {
                  console.error('PayPal Buttons Error:', err);
                  setErrorMessage('Ocurrió un error con la pasarela de PayPal.');
                }}
              />
            </div>

            <button
              onClick={() => setStep('details')}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase tracking-wider mt-2"
            >
              ← Volver a los detalles
            </button>

            <p className="text-[10px] text-gray-500 text-center mt-4">
              Pago seguro encriptado de nivel 256-bit procesado por PayPal
            </p>
          </div>
        )}
      </div>
    </div>
  );
};