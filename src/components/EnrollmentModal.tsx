'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { Language, translations } from '@/lib/translations';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'es',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [isLoading, setIsLoading] = useState(false);
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

  // Lock body scroll while preserving scroll position
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      setErrorMessage(null);
      setIsLoading(false);

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

  const handleContinuePayment = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok || !data.approveUrl) {
        throw new Error(data.error || 'No se pudo generar la orden de PayPal');
      }

      // Cerrar el modal de Ferreira Academy y redirigir al Checkout oficial de PayPal
      onClose();
      window.location.href = data.approveUrl;
    } catch (err: any) {
      console.error('Error iniciando Checkout de PayPal:', err);
      setIsLoading(false);
      setErrorMessage('Ocurrió un error al conectar con el Checkout de PayPal.');
    }
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
        {/* Top Gold Subtle Shimmer Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

        {/* Close Button (Top Right) */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/5 border border-[#D4AF37]/20 text-gray-300 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header section: Logo & Titles */}
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

        {/* Course Info Card */}
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

        {/* Includes Section */}
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

        {/* Important Info Note */}
        <p className="text-[10px] sm:text-xs text-gray-400 text-center leading-normal mb-4 px-1 font-medium">
          {t.paymentNote}
        </p>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/40 rounded-xl text-center text-xs font-bold text-rose-400">
            {errorMessage}
          </div>
        )}

        {/* Main Action Button */}
        <button
          onClick={handleContinuePayment}
          disabled={isLoading}
          className="group w-full btn-gold-primary py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isLoading ? 'Redirigiendo a PayPal...' : t.continuePayment}</span>
        </button>
      </div>
    </div>
  );
};
