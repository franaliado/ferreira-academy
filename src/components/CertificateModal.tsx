'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Award, Loader2, AlertCircle, PartyPopper } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

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
  currentLang?: Language;
}

// ─── WhatsApp VIP Community URL ───────────────────────────────────────────────
const WHATSAPP_VIP_URL =
  'https://chat.whatsapp.com/DYZZgiY5rm4Imls1wGIZzy?s=cl&p=a&ilr=1';

const openWhatsAppVipCommunity = (url: string = WHATSAPP_VIP_URL) => {
  if (typeof window !== 'undefined') {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;

    if (isMobile) {
      // Mobile-first: opens direct link so native OS opens WhatsApp app directly
      window.location.href = url;
    } else {
      // PC / Desktop: opens in new tab to keep landing page open in background
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  captureData,
  onClose,
  currentLang = 'es',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lang = currentLang && translations[currentLang] ? currentLang : 'es';
  const t = translations[lang].certificateModal;

  // ── State ─────────────────────────────────────────────────────
  const [certificateName, setCertificateName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmedName, setConfirmedName] = useState('');

  // ── Derived: is the submit button enabled? ─────────────────────
  const isNameValid = certificateName.trim().length >= 3;

  // ── Reset state when modal opens ──────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setCertificateName('');
      setFieldError(null);
      setSubmitError(null);
      setIsSubmitting(false);
      setShowSuccess(false);
      setConfirmedName('');

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

  // ── Submit handler ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = certificateName.trim();

    // Strict validation: at least 3 non-whitespace characters
    if (trimmed.length < 3) {
      setFieldError(t.minLengthError);
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > 150) {
      setFieldError(t.maxLengthError);
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
        amount: String(captureData.amount || '95.00'),
        currency: captureData.currency || 'USD',
        certificate_name: trimmed,
      };

      const res = await fetch('/api/registrations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (res.status === 409) {
        // Duplicate order — already registered; show success screen anyway
        console.warn('[CertificateModal] Duplicate order detected, showing success screen.');
        setConfirmedName(trimmed);
        setIsSubmitting(false);
        setShowSuccess(true);
        return;
      }

      if (!res.ok) {
        // Log the full error to console, show friendly localized message to user
        console.error('[CertificateModal] Registration error:', responseData);
        setSubmitError(t.submitError);
        setIsSubmitting(false);
        return;
      }

      // ── Success: switch to confirmation screen ─────────────────
      setConfirmedName(trimmed);
      setIsSubmitting(false);
      setShowSuccess(true);
    } catch (err: unknown) {
      console.error('[CertificateModal] Unexpected fetch error:', err);
      setSubmitError(t.submitError);
      setIsSubmitting(false);
    }
  };

  // ── Accept handler (success screen) ──────────────────────────
  const handleAccept = () => {
    openWhatsAppVipCommunity(WHATSAPP_VIP_URL);
    onClose();
  };

  // ── Course name for success screen ───────────────────────────
  const courseName = translations[lang].enrollmentModal.courseTitle;
  // Resolve placeholders in each line
  const successLine1 = t.successLine1.replace('{name}', confirmedName).replace('{course}', courseName);
  const successLine2 = t.successLine2.replace('{name}', confirmedName).replace('{course}', courseName);
  const successLine3 = t.successLine3.replace('{name}', confirmedName).replace('{course}', courseName);

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
        @keyframes certSuccessIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes certConfettiPop {
          0%   { transform: scale(0.3) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(8deg); opacity: 1; }
          80%  { transform: scale(0.92) rotate(-4deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .cert-modal-container {
          animation: certModalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cert-success-container {
          animation: certSuccessIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cert-icon-animate {
          animation: certIconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }
        .cert-confetti-animate {
          animation: certConfettiPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
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
        .cert-btn-accept {
          background: linear-gradient(135deg, #b8860b 0%, #D4AF37 40%, #f3e5ab 60%, #D4AF37 80%, #b8860b 100%);
          background-size: 200% auto;
          transition: background-position 0.4s ease, opacity 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cert-btn-accept:hover {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(212,175,55,0.45);
        }
        .cert-btn-accept:active {
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

        {/* ════════════════════════════════════════════════════════
            VISTA A: FORMULARIO DE NOMBRE
        ════════════════════════════════════════════════════════ */}
        {!showSuccess && (
          <div className="relative z-10 px-6 pt-8 pb-7 sm:px-8 sm:pt-9 sm:pb-8">

            {/* ── Logo ─────────────────────────────────────────── */}
            <div className="flex justify-center mb-3">
              <div className="relative w-52 sm:w-60 h-28 sm:h-36">
                <Image
                  src="/Logo_Oficial_Negro.png"
                  alt="Ferreira Academy Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* ── Success icon ────────────────────────────────────── */}
            <div className="flex justify-center mb-5">
              <div
                className="cert-icon-animate w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D4AF37]/60 bg-[#D4AF37]/10 flex items-center justify-center"
                style={{ animation: 'certIconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both, certGoldPulse 2s ease-in-out 0.7s infinite' }}
              >
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#D4AF37]" />
              </div>
            </div>

            {/* ── Title ─────────────────────────────────────────────── */}
            <h2
              id="cert-modal-title"
              className="text-center text-xl sm:text-2xl font-black uppercase tracking-wider text-white leading-tight mb-3"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {t.successTitlePart1}
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(90deg, #b8860b, #D4AF37, #f3e5ab, #D4AF37, #b8860b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t.successTitlePart2}
              </span>
            </h2>

            {/* ── Body text ─────────────────────────────────────────── */}
            <p className="text-center text-sm text-gray-300 leading-relaxed mb-1">
              {t.confirmedSubtitle}
            </p>
            <p className="text-center text-sm text-gray-400 leading-relaxed mb-6">
              {t.dataNoticePart1}
              <span className="text-[#D4AF37] font-semibold">{t.dataNoticeHighlight}</span>
              {t.dataNoticePart2}
            </p>

            {/* ── Divider ───────────────────────────────────────────── */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent mb-6" />

            {/* ── Certificate icon decoration ───────────────────────── */}
            <div className="flex items-center justify-center space-x-2 mb-5">
              <Award className="w-4 h-4 text-[#D4AF37]/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/70">
                {t.badgeLabel}
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
                  {t.inputLabel}
                </label>
                <input
                  ref={inputRef}
                  id="cert-name-input"
                  type="text"
                  value={certificateName}
                  onChange={(e) => {
                    setCertificateName(e.target.value);
                    if (fieldError) setFieldError(null);
                    if (submitError) setSubmitError(null);
                  }}
                  placeholder={t.inputPlaceholder}
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
                {/* Error + counter row */}
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

              {/* ── Submit button — disabled until trimmed.length >= 3 ── */}
              <button
                type="submit"
                id="cert-submit-btn"
                disabled={isSubmitting || !isNameValid}
                className="cert-btn-gold w-full py-3.5 px-6 rounded-xl text-black font-black text-sm uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.submittingButton}</span>
                  </>
                ) : (
                  <span>{t.submitButton}</span>
                )}
              </button>
            </form>

            {/* ── Footer note ───────────────────────────────────────── */}
            <p className="text-center text-[10px] text-gray-600 mt-5 leading-relaxed">
              {t.footerNotePart1}
              <span className="text-[#25D366]">{t.footerNoteHighlight}</span>
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            VISTA B: PANTALLA DE EXITO / CONFIRMACION
        ════════════════════════════════════════════════════════ */}
        {showSuccess && (
          <div className="cert-success-container relative z-10 px-6 pt-10 pb-8 sm:px-8 sm:pt-12 sm:pb-10 flex flex-col items-center text-center">

            {/* Gold success glow background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

            {/* ── Logo ─────────────────────────────────────────── */}
            <div className="flex justify-center mb-3">
              <div className="relative w-52 sm:w-60 h-28 sm:h-36">
                <Image
                  src="/Logo_Oficial_Negro.png"
                  alt="Ferreira Academy Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* ── Celebration icon (gold) ────────────────────────── */}
            <div
              className="cert-confetti-animate w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#D4AF37]/60 bg-[#D4AF37]/10 flex items-center justify-center mb-6"
              style={{ animation: 'certConfettiPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both, certGoldPulse 2s ease-in-out 0.8s infinite' }}
            >
              <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]" />
            </div>

            {/* ── Title ─────────────────────────────────────────── */}
            <h2
              id="cert-modal-title"
              className="text-2xl sm:text-3xl font-black uppercase tracking-wider leading-tight mb-5"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <span
                style={{
                  background: 'linear-gradient(90deg, #b8860b, #D4AF37, #f3e5ab, #D4AF37, #b8860b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t.successScreenTitle}
              </span>
            </h2>

            {/* ── 3-line personalized success message ───────────── */}
            <div className="w-full bg-[#0d0a00] border border-[#D4AF37]/25 rounded-2xl px-5 py-5 mb-8">
              {/* Line 1: Certificate name — highlighted gold */}
              <p
                className="text-lg sm:text-xl font-black leading-snug mb-1"
                style={{
                  background: 'linear-gradient(90deg, #b8860b, #D4AF37, #f3e5ab, #D4AF37, #b8860b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {successLine1}
              </p>
              {/* Line 2: Action text — muted white */}
              <p className="text-sm sm:text-base text-gray-300 font-medium leading-snug mb-1">
                {successLine2}
              </p>
              {/* Line 3: Course name — gold italic */}
              <p
                className="text-base sm:text-lg font-bold italic leading-snug"
                style={{ color: '#D4AF37' }}
              >
                {successLine3}
              </p>
            </div>

            {/* ── Accept button (gold) ──────────────────────────── */}
            <button
              type="button"
              id="cert-accept-btn"
              onClick={handleAccept}
              className="cert-btn-accept w-full py-4 px-6 rounded-xl text-black font-black text-sm sm:text-base uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{t.acceptButton}</span>
            </button>

            {/* ── Footer note ──────────────────────────────────── */}
            <p className="text-[10px] text-gray-600 mt-4 leading-relaxed">
              {t.footerNotePart1}
              <span className="text-[#D4AF37]">{t.footerNoteHighlight}</span>
            </p>
          </div>
        )}

        {/* Gold bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>
    </div>
  );
};
