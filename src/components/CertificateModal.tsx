'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Award, Loader2, AlertCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentCaptureData {
  /** PayPal order ID (COMPLETED status confirmed) */
  orderID: string;
  /** PayPal capture ID */
  captureID?: string;
  /** Full name returned by PayPal */
  payerName: string;
  /** Email returned by PayPal */
  payerEmail: string;
  /** Phone returned by PayPal (may be null/undefined) */
  payerPhone?: string | null;
  /** Country returned by PayPal */
  payerCountry?: string;
  /** Payment method: 'paypal' | 'card' */
  paymentMethod: 'paypal' | 'card';
  /** Amount captured */
  amount: string;
  /** Currency code */
  currency: string;
  /** PayPal payer ID */
  payerID?: string;
}

interface CertificateModalProps {
  isOpen: boolean;
  captureData: PaymentCaptureData | null;
  onClose: () => void;
}

// ─── WhatsApp VIP Community URL ───────────────────────────────────────────────
const WHATSAPP_VIP_URL =
  'https://chat.whatsapp.com/DYZZgiY5rm4Imls1wGIZzy?s=cl&p=a&ilr=1';

// ─── Component ────────────────────────────────────────────────────────────────

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  captureData,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [certificateName, setCertificateName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Reset state when modal opens ──────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setCertificateName('');
      setFieldError(null);
      setSubmitError(null);
      setIsSubmitting(false);

      // Lock body scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Focus input after animation settles
      requestAnimationFrame(() => {
        setTimeout(() => inputRef.current?.focus(), 320);
      });
    } else {
      // Restore body scroll
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

  // ── Focus trap & ESC handler ──────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || isSubmitting) return;

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen, isSubmitting]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── Form validation ───────────────────────────────────────────
  const validateName = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return 'Este campo es obligatorio.';
    if (trimmed.length > 150) return 'Máximo 150 caracteres permitidos.';
    return null;
  };

  // ── Submit handler ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateName(certificateName);
    if (validationError) {
      setFieldError(validationError);
      inputRef.current?.focus();
      return;
    }

    if (!captureData) return;

    setIsSubmitting(true);
    setFieldError(null);
    setSubmitError(null);

    try {
      const payload = {
        paypal_order_id: captureData.orderID,
        payer_id: captureData.payerID || '',
        buyer_name: captureData.payerName || '',
        email: captureData.payerEmail || '',
        phone: captureData.payerPhone || null,
        country: captureData.payerCountry || 'N/A',
        payment_method: captureData.paymentMethod,
        amount: captureData.amount || '95.00',
        currency: captureData.currency || 'USD',
        certificate_name: certificateName.trim(),
      };

      const res = await fetch('/api/registrations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (res.status === 409) {
        // Duplicate order — already registered; still redirect to WhatsApp
        console.warn('[CertificateModal] Duplicate order detected, redirecting to WhatsApp anyway.');
        onClose();
        window.location.href = WHATSAPP_VIP_URL;
        return;
      }

      if (!res.ok) {
        // Log the full error to console, show friendly message to user
        console.error('[CertificateModal] Registration error:', responseData);
        setSubmitError(
          responseData?.message ||
            'Tu pago fue recibido correctamente, pero ocurrió un problema registrando tu inscripción. Nuestro equipo revisará tu caso.'
        );
        setIsSubmitting(false);
        return;
      }

      // ── Success: close modal and redirect to WhatsApp ──────────
      onClose();
      window.location.href = WHATSAPP_VIP_URL;
    } catch (err: unknown) {
      console.error('[CertificateModal] Unexpected fetch error:', err);
      setSubmitError(
        'Tu pago fue recibido correctamente, pero ocurrió un problema registrando tu inscripción. Nuestro equipo revisará tu caso.'
      );
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !captureData) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      style={{ animation: 'certOverlayFadeIn 0.3s ease-out forwards' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
    >
      {/* ── Animations ───────────────────────────────────────── */}
      <style>{`
        @keyframes certOverlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes certModalSlideUp {
          from { opacity: 0; transform: scale(0.93) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes certGoldPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(212,175,55,0); }
        }
        @keyframes certIconBounce {
          0%   { transform: scale(0.5) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
          80%  { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes certShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .cert-modal-container {
          animation: certModalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cert-icon-animate {
          animation: certIconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }
        .cert-gold-input:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.18);
        }
        .cert-btn-gold {
          background: linear-gradient(135deg, #b8860b 0%, #D4AF37 40%, #f3e5ab 60%, #D4AF37 80%, #b8860b 100%);
          background-size: 200% auto;
          transition: background-position 0.4s ease, opacity 0.2s ease, transform 0.15s ease;
        }
        .cert-btn-gold:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(212,175,55,0.35);
        }
        .cert-btn-gold:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>

      {/* ── Modal box ─────────────────────────────────────────── */}
      <div
        ref={modalRef}
        className="cert-modal-container relative w-full max-w-md bg-[#050505] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.12)]"
      >
        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Subtle background glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#D4AF37]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 px-6 pt-8 pb-7 sm:px-8 sm:pt-9 sm:pb-8">

          {/* ── Logo ────────────────────────────────────────────── */}
          <div className="flex justify-center mb-5">
            <div className="relative w-28 h-14 sm:w-32 sm:h-16">
              <Image
                src="/public/Logo_Oficial_Negro.png"
                alt="Ferreira Academy"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* ── Success icon ──────────────────────────────────────── */}
          <div className="flex justify-center mb-5">
            <div
              className="cert-icon-animate w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-[#D4AF37]/60 bg-[#D4AF37]/10 flex items-center justify-center"
              style={{ animation: 'certIconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both, certGoldPulse 2s ease-in-out 0.7s infinite' }}
            >
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-[#D4AF37]" />
            </div>
          </div>

          {/* ── Title ─────────────────────────────────────────────── */}
          <h2
            id="cert-modal-title"
            className="text-center text-xl sm:text-2xl font-black uppercase tracking-wider text-white leading-tight mb-3"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            ¡Pago realizado{' '}
            <span
              className="inline-block"
              style={{
                background: 'linear-gradient(90deg, #b8860b, #D4AF37, #f3e5ab, #D4AF37, #b8860b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              correctamente!
            </span>
          </h2>

          {/* ── Body text ─────────────────────────────────────────── */}
          <p className="text-center text-sm text-gray-300 leading-relaxed mb-1">
            Tu inscripción ha sido confirmada correctamente.
          </p>
          <p className="text-center text-sm text-gray-400 leading-relaxed mb-6">
            Solo necesitamos un último dato para emitir correctamente tu{' '}
            <span className="text-[#D4AF37] font-semibold">Certificado Digital</span>{' '}
            cuando finalice el curso.
          </p>

          {/* ── Divider ───────────────────────────────────────────── */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent mb-6" />

          {/* ── Certificate icon decoration ───────────────────────── */}
          <div className="flex items-center justify-center space-x-2 mb-5">
            <Award className="w-4 h-4 text-[#D4AF37]/60" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/70">
              Datos para el certificado
            </span>
            <Award className="w-4 h-4 text-[#D4AF37]/60" />
          </div>

          {/* ── Form ──────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label
                htmlFor="cert-name-input"
                className="block text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2"
              >
                Nombre que aparecerá en el certificado
              </label>
              <input
                ref={inputRef}
                id="cert-name-input"
                type="text"
                value={certificateName}
                onChange={(e) => {
                  setCertificateName(e.target.value);
                  if (fieldError) setFieldError(null);
                }}
                placeholder="Ejemplo: Antonio José Ferreira"
                maxLength={150}
                disabled={isSubmitting}
                className={`cert-gold-input w-full bg-[#111111] border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldError
                    ? 'border-rose-500/70 bg-rose-950/10'
                    : 'border-[#D4AF37]/25 hover:border-[#D4AF37]/45'
                }`}
                aria-required="true"
                aria-invalid={!!fieldError}
                aria-describedby={fieldError ? 'cert-name-error' : undefined}
              />
              {/* Character counter */}
              <div className="flex items-start justify-between mt-1.5">
                <div>
                  {fieldError && (
                    <p
                      id="cert-name-error"
                      className="text-xs text-rose-400 font-medium flex items-center space-x-1"
                    >
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{fieldError}</span>
                    </p>
                  )}
                </div>
                <span
                  className={`text-[10px] font-mono shrink-0 ml-2 ${
                    certificateName.length > 130
                      ? certificateName.length > 150
                        ? 'text-rose-400'
                        : 'text-amber-400'
                      : 'text-gray-600'
                  }`}
                >
                  {certificateName.length}/150
                </span>
              </div>
            </div>

            {/* ── Submit error ────────────────────────────────────── */}
            {submitError && (
              <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/35 rounded-xl text-xs font-medium text-rose-300 leading-relaxed">
                {submitError}
              </div>
            )}

            {/* ── Submit button ────────────────────────────────────── */}
            <button
              type="submit"
              id="cert-submit-btn"
              disabled={isSubmitting}
              className="cert-btn-gold w-full py-3.5 px-6 rounded-xl text-black font-black text-sm uppercase tracking-wider cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Finalizando inscripción…</span>
                </>
              ) : (
                <span>Finalizar inscripción</span>
              )}
            </button>
          </form>

          {/* ── Footer note ───────────────────────────────────────── */}
          <p className="text-center text-[10px] text-gray-600 mt-5 leading-relaxed">
            Al finalizar serás redirigido automáticamente a la{' '}
            <span className="text-[#25D366]">Comunidad VIP de WhatsApp</span>
          </p>
        </div>

        {/* Gold bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>
    </div>
  );
};
