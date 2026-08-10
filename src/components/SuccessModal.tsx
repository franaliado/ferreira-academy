'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { PartyPopper, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '@/lib/translations';
import { currentCourse } from '@/data/currentCourse';

interface SuccessModalProps {
  isOpen: boolean;
  certificateName: string;
  courseName: string;
  onClose: () => void;
  currentLang?: Language;
}

const WHATSAPP_VIP_URL = 'https://chat.whatsapp.com/DYZZgiY5rm4Imls1wGIZzy?s=cl&p=a&ilr=1';

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  certificateName,
  courseName,
  onClose,
  currentLang = 'es',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const acceptBtnRef = useRef<HTMLButtonElement>(null);

  const lang = currentLang && translations[currentLang] ? currentLang : 'es';
  const t = translations[lang].successModal || {
    title: '¡Inscripción completada!',
    participantLabel: 'Nombre del participante:',
    enrolledIn: 'Has sido inscrito correctamente en:',
    registrationSuccess: 'Tu inscripción ha sido registrada correctamente.',
    emailNotice: 'Recibirás posteriormente la información correspondiente en tu correo electrónico.',
    whatsappNotice: 'Serás dirigido a la comunidad VIP de WhatsApp.',
    acceptButton: 'Aceptar',
  };

  const handleAccept = () => {
    onClose();
    if (typeof window !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      if (isMobile) {
        // Mobile: Abrir enlace oficial de invitación para que el SO abra la app de WhatsApp
        window.location.href = WHATSAPP_VIP_URL;
      } else {
        // Desktop: Abrir WhatsApp en una nueva pestaña y la pestaña actual regresa/se mantiene en la landing page
        window.open(WHATSAPP_VIP_URL, '_blank', 'noopener,noreferrer');
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        acceptBtnRef.current?.focus();
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
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <style jsx global>{`
        @keyframes successModalPop {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(16px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-success-pop {
          animation: successModalPop 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes goldGlowPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(212,175,55,0.2); }
          50% { box-shadow: 0 0 35px rgba(212,175,55,0.45); }
        }
        .gold-glow {
          animation: goldGlowPulse 2.5s infinite ease-in-out;
        }
      `}</style>

      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#070707] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.2)] text-white overflow-hidden animate-success-pop text-center"
      >
        {/* Top gold bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        
        {/* Radial background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex justify-center mb-3">
          <div className="relative w-48 sm:w-56 h-20 sm:h-24">
            <Image
              src="/Logo_Oficial_Negro.png"
              alt="Ferreira Academy Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Celebration icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center gold-glow">
            <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-[#D4AF37]" />
          </div>
        </div>

        {/* Title */}
        <h2
          id="success-modal-title"
          className="text-2xl sm:text-3xl font-black uppercase tracking-wider gold-gradient-text font-cinzel leading-tight mb-4"
        >
          {t.title}
        </h2>

        {/* Summary box */}
        <div className="bg-[#111111] border border-[#D4AF37]/30 rounded-xl p-4 sm:p-5 mb-5 text-left space-y-3">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              {t.participantLabel}
            </p>
            <p className="text-base sm:text-lg font-black text-white mt-0.5">
              {certificateName}
            </p>
          </div>

          <div className="h-px bg-white/10" />

          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">
              {t.enrolledIn}
            </p>
            <p className="text-xs sm:text-sm font-bold text-amber-200 mt-0.5">
              {courseName || currentCourse.name}
            </p>
          </div>
        </div>

        {/* Explanatory text */}
        <div className="space-y-2 text-xs sm:text-sm text-gray-300 font-medium mb-6 leading-relaxed">
          <p className="text-white font-semibold flex items-center justify-center space-x-1.5">
            <span>✨</span>
            <span>{t.registrationSuccess}</span>
          </p>
          <p className="text-gray-400">
            {t.emailNotice}
          </p>
          <p className="text-[#D4AF37] font-semibold pt-1">
            {t.whatsappNotice}
          </p>
        </div>

        {/* Accept Button */}
        <button
          ref={acceptBtnRef}
          onClick={handleAccept}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#b8860b] via-[#D4AF37] to-[#b8860b] text-black font-black uppercase tracking-wider text-sm sm:text-base shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          {t.acceptButton}
        </button>

        {/* Bottom gold bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>
    </div>
  );
};
