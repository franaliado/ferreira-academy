'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { Language, translations } from '@/lib/translations';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { ShieldCheck, X, ChevronRight, User, ChevronDown } from 'lucide-react';
import type { PaymentCaptureData } from '@/components/CertificateModal';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
  /** Called when a PayPal payment is captured with status COMPLETED */
  onPaymentCompleted?: (data: PaymentCaptureData) => void;
}

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  dial: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dial: '+58' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', dial: '+1' },
  { code: 'ES', name: 'España', flag: '🇪🇸', dial: '+34' },
  { code: 'MX', name: 'México', flag: '🇲🇽', dial: '+52' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dial: '+57' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dial: '+54' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dial: '+56' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪', dial: '+51' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dial: '+593' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', dial: '+1' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', dial: '+1' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦', dial: '+507' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', dial: '+506' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', dial: '+502' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', dial: '+55' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dial: '+351' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹', dial: '+39' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷', dial: '+33' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪', dial: '+49' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧', dial: '+44' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦', dial: '+1' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dial: '+598' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dial: '+595' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', dial: '+591' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', dial: '+503' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', dial: '+504' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', dial: '+505' },
];

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

  // Participant Information form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Venezuela');
  const [phonePrefix, setPhonePrefix] = useState('+58');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

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
      setFullName('');
      setEmail('');
      setCountry('Venezuela');
      setPhonePrefix('+58');
      setPhoneNumber('');
      setValidationError(null);

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

  const handleProceedToCheckout = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      setValidationError(t.requiredFieldsError);
      return;
    }
    setValidationError(null);
    setStep('checkout');
  };

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

        {/* ── VISTA 1: DETALLES Y FORMULARIO DE PARTICIPANTE ── */}
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

            {/* Price Box */}
            <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-xl p-3.5 sm:p-4 mb-4 shadow-inner flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  {t.officialPriceLabel}
                </p>
                <p className="text-white font-bold text-xs sm:text-sm">
                  {t.includes.inPersonTraining}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[#D4AF37] font-black text-lg sm:text-2xl tracking-tight">
                  $95.00 USD
                </span>
              </div>
            </div>

            {/* PARTICIPANT INFORMATION SECTION */}
            <form onSubmit={handleProceedToCheckout} className="mb-2">
              <div className="flex items-center space-x-2 border-b border-[#D4AF37]/20 pb-2 mb-3.5">
                <User className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs sm:text-sm font-extrabold text-[#D4AF37] uppercase tracking-wider">
                  {t.participantInfoTitle}
                </h3>
              </div>

              <div className="space-y-3 mb-4">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">
                    {t.fullNameLabel} <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    required
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">
                    {t.emailLabel} <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    required
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">
                    {t.countryLabel} <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        setCountry(selectedName);
                        const found = COUNTRIES.find((c) => c.name === selectedName);
                        if (found) {
                          setPhonePrefix(found.dial);
                        }
                      }}
                      className="w-full bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all appearance-none cursor-pointer pr-10"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name} className="bg-[#121212] text-white">
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">
                    {t.phoneLabel} <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-24">
                      <select
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl px-2.5 py-2.5 text-white text-xs sm:text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all appearance-none cursor-pointer text-center"
                      >
                        {Array.from(new Set(COUNTRIES.map((c) => c.dial))).map((dial) => (
                          <option key={dial} value={dial} className="bg-[#121212] text-white">
                            {dial}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="flex-1 bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* INCLUDES section */}
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

              {validationError && (
                <div className="mb-3 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-center text-xs text-rose-400 font-medium">
                  {validationError}
                </div>
              )}

              <button
                type="submit"
                className="w-full group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#D4AF37] via-[#f3e5ab] to-[#D4AF37] text-black font-black py-3.5 px-6 rounded-xl uppercase tracking-wider text-xs sm:text-sm shadow-lg hover:opacity-95 transition-all cursor-pointer"
              >
                <span>{`${t.proceedToPaymentBtn} — $95.00 USD`}</span>
                <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
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
                  Fade Mastery Elite
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
                      const paymentSource = (data as unknown as Record<string, unknown>).paymentSource as string | undefined;
                      const fundingSource = details.fundingSource || '';
                      const isCard =
                        typeof paymentSource === 'string'
                          ? paymentSource === 'card'
                          : fundingSource === 'card' || fundingSource === 'credit_card' || fundingSource === 'debit_card';

                      const captureData: PaymentCaptureData = {
                        orderID: details.orderID || data.orderID,
                        captureID: details.captureID,
                        payerName: fullName.trim() || details.payerName || '',
                        payerEmail: email.trim() || details.payerEmail || '',
                        payerPhone: phoneNumber.trim() ? `${phonePrefix} ${phoneNumber.trim()}` : (details.payerPhone || null),
                        payerCountry: country || details.payerCountry || 'N/A',
                        paymentMethod: isCard ? 'card' : 'paypal',
                        amount: details.amount || '95.00',
                        currency: details.currency || 'USD',
                        payerID: details.payerID || data.payerID || '',
                      };

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