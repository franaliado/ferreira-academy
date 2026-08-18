'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { Language, translations } from '@/lib/translations';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { ShieldCheck, X, ChevronRight, ChevronLeft, User, ChevronDown } from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';

export interface RegistrationSuccessData {
  certificateName: string;
  courseName: string;
  email?: string;
  phone?: string | null;
  country?: string | null;
}

export interface CourseInfo {
  id?: string;
  title: string;
  displayPrice: string;
  priceAmount: string;
  currency: string;
  isPresencial: boolean;
}

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
  currentCourse?: CourseInfo;
  onPaymentCompleted?: (data: RegistrationSuccessData) => void;
}

interface CountryOption {
  code: string;
  name: string;
  dial: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 've', name: 'Venezuela', dial: '+58' },
  { code: 'us', name: 'Estados Unidos', dial: '+1' },
  { code: 'es', name: 'España', dial: '+34' },
  { code: 'mx', name: 'México', dial: '+52' },
  { code: 'co', name: 'Colombia', dial: '+57' },
  { code: 'ar', name: 'Argentina', dial: '+54' },
  { code: 'cl', name: 'Chile', dial: '+56' },
  { code: 'pe', name: 'Perú', dial: '+51' },
  { code: 'ec', name: 'Ecuador', dial: '+593' },
  { code: 'do', name: 'República Dominicana', dial: '+1' },
  { code: 'pr', name: 'Puerto Rico', dial: '+1' },
  { code: 'pa', name: 'Panamá', dial: '+507' },
  { code: 'cr', name: 'Costa Rica', dial: '+506' },
  { code: 'gt', name: 'Guatemala', dial: '+502' },
  { code: 'br', name: 'Brasil', dial: '+55' },
  { code: 'pt', name: 'Portugal', dial: '+351' },
  { code: 'it', name: 'Italia', dial: '+39' },
  { code: 'fr', name: 'Francia', dial: '+33' },
  { code: 'de', name: 'Alemania', dial: '+49' },
  { code: 'gb', name: 'Reino Unido', dial: '+44' },
  { code: 'ca', name: 'Canadá', dial: '+1' },
  { code: 'uy', name: 'Uruguay', dial: '+598' },
  { code: 'py', name: 'Paraguay', dial: '+595' },
  { code: 'bo', name: 'Bolivia', dial: '+591' },
  { code: 'sv', name: 'El Salvador', dial: '+503' },
  { code: 'hn', name: 'Honduras', dial: '+504' },
  { code: 'ni', name: 'Nicaragua', dial: '+505' },
];

const getDefaultCountryForLang = (lang: Language): CountryOption => {
  switch (lang) {
    case 'en':
      return COUNTRIES.find((c) => c.code === 'us') || COUNTRIES[0];
    case 'pt':
      return COUNTRIES.find((c) => c.code === 'br') || COUNTRIES[0];
    case 'it':
      return COUNTRIES.find((c) => c.code === 'it') || COUNTRIES[0];
    case 'fr':
      return COUNTRIES.find((c) => c.code === 'fr') || COUNTRIES[0];
    case 'de':
      return COUNTRIES.find((c) => c.code === 'de') || COUNTRIES[0];
    case 'es':
    default:
      return COUNTRIES.find((c) => c.code === 've') || COUNTRIES[0];
  }
};

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'es',
  currentCourse,
  onPaymentCompleted,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const defaultCountryObj = getDefaultCountryForLang(currentLang);

  const [step, setStep] = useState<'details' | 'checkout'>('details');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState(defaultCountryObj.name);
  const [phonePrefix, setPhonePrefix] = useState(defaultCountryObj.dial);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Geolocalización automática por IP para ignorar el idioma al abrir el modal
  useEffect(() => {
    if (isOpen) {
      async function detectUserCountry() {
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data && data.country_name) {
            // Buscamos si el país detectado está en nuestra lista de COUNTRIES
            const matchedCountry = COUNTRIES.find(
              (c) => c.name.toLowerCase() === data.country_name.toLowerCase() || c.code.toLowerCase() === data.country_code?.toLowerCase()
            );
            if (matchedCountry) {
              setCountry(matchedCountry.name);
              setPhonePrefix(matchedCountry.dial);
            }
          }
        } catch (err) {
          console.error('No se pudo detectar el país por IP:', err);
        }
      }
      detectUserCountry();
    }
  }, [isOpen]);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = raw.replace(/[^a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜàèìòùÀÈÌÒÙñÑ\s-]/g, '');
    const titled = filtered.replace(
      /(^|[\s-])([a-záéíóúäëïöüàèìòùñ])/g,
      (_match: string, sep: string, char: string) => sep + char.toUpperCase()
    );
    setFullName(titled.slice(0, 100));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.toLowerCase().slice(0, 254));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digits);
  };

  const t = (translations[currentLang] || translations.es).enrollmentModal;

  const course = currentCourse || {
    id: 'faded-mastery-elite-2026',
    title: '',
    displayPrice: '$0.00',
    priceAmount: '0',
    currency: 'USD',
    isPresencial: false,
  };

  const includes = [
    { icon: '📜', label: t.includes.certificate, show: true },
    { icon: '📚', label: t.includes.courseMaterial, show: true },
    { icon: '👑', label: t.includes.vipCommunity, show: true },
    { icon: '☕', label: t.includes.coffeeBreak, show: course.isPresencial },
    {
      icon: course.isPresencial ? '✂️' : '💻',
      label: course.isPresencial ? t.includes.inPersonTraining : (t.includes.zoomTraining || 'Capacitación en Vivo por Zoom'),
      show: true,
    },
  ].filter((item) => item.show);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
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
    [isOpen]
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
      setCountry(defaultCountryObj.name);
      setPhonePrefix(defaultCountryObj.dial);
      setPhoneNumber('');
      setCountryDropdownOpen(false);
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

  const handleProceedToCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 3) {
      setValidationError('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setValidationError('Ingresa un correo electrónico válido (ej: nombre@dominio.com).');
      return;
    }

    if (!country) {
      setValidationError('Selecciona un país.');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 8 || phoneNumber.length > 10) {
      setValidationError('El número de teléfono debe tener entre 8 y 10 dígitos.');
      return;
    }

    setValidationError(null);
    setIsCheckingDuplicate(true);

    try {
      const formattedPhone = `${phonePrefix} ${phoneNumber.trim()}`;
      const res = await fetch('/api/registrations/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: formattedPhone,
          courseId: course.id,
          courseName: course.title,
        }),
      });

      const data = await res.json();
      if (data.isDuplicate) {
        setValidationError(
          data.error || translations[currentLang]?.enrollmentModal?.duplicateError || 'Los datos de contacto proporcionados ya se encuentran registrados para este curso.'
        );
        setIsCheckingDuplicate(false);
        return;
      }
    } catch (err) {
      console.error('Error al verificar duplicado:', err);
    } finally {
      setIsCheckingDuplicate(false);
    }

    setStep('checkout');
  };

  const selectedCountryObj = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-course-title"
    >
      <style jsx global>{`
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-scale { animation: modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
      `}</style>

      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-2xl p-3.5 sm:p-4.5 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.15)] text-white animate-modal-scale max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

        {step === 'details' && (
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label={t.close}
            className="absolute top-3 right-3 p-1.5 sm:p-2 rounded-full bg-white/5 border border-[#D4AF37]/20 text-gray-300 hover:text-[#D4AF37] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] z-20"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {step === 'details' && (
          <>
            <div className="flex flex-col items-center text-center mt-1 mb-0">
              <div className="relative w-36 sm:w-44 h-32 sm:h-40 -mb-8 overflow-visible">
                <Image
                  src="/Logo_Oficial_Negro.png"
                  alt="Ferreira Academy Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="z-10 relative mt-2 pt-0">
                <h2
                  id="modal-course-title"
                  className="text-base sm:text-xl font-black uppercase tracking-wider gold-gradient-text font-cinzel leading-tight bg-black px-2 py-0.5"
                >
                  {course.title}
                </h2>
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-gray-400 mt-0.5 bg-black px-2 py-0.5 inline-block">
                  {course.isPresencial ? (t.subtitlePresencial || t.subtitle) : (t.subtitleZoom || t.subtitle)}
                </p>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-xl p-2.5 sm:p-3 mb-2.5 shadow-inner flex items-center justify-between mt-2.5">
              <div>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  {t.officialPriceLabel}
                </p>
                <p className="text-white font-bold text-xs">
                  {course.isPresencial ? t.includes.inPersonTraining : (t.includes.zoomTraining || 'Capacitación en Vivo por Zoom')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[#D4AF37] font-black text-sm sm:text-base tracking-tight">
                  {course.displayPrice}
                </span>
              </div>
            </div>

            <form onSubmit={handleProceedToCheckout} className="mb-1">
              <div className="flex items-center space-x-2 border-b border-[#D4AF37]/20 pb-1.5 mb-2.5">
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <h3 className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-wider">
                  {t.participantInfoTitle}
                </h3>
              </div>

              <div className="space-y-2 mb-2.5">
                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-gray-300 mb-0.5 block">
                    {t.fullNameLabel} <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={handleFullNameChange}
                    placeholder={t.fullNamePlaceholder}
                    maxLength={100}
                    minLength={3}
                    autoComplete="name"
                    className="w-full bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-1.5 text-white text-xs sm:text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-gray-300 mb-0.5 block">
                    {t.emailLabel} <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={t.emailPlaceholder}
                    maxLength={254}
                    autoComplete="email"
                    className="w-full bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-1.5 text-white text-xs sm:text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-gray-300 mb-0.5 block">
                    {t.countryLabel} <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative" ref={countryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                      className="w-full flex items-center justify-between bg-[#121212] border border-white/10 hover:border-[#D4AF37]/50 focus:border-[#D4AF37] rounded-xl px-3 py-1.5 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className={`fi fi-${selectedCountryObj.code} rounded-sm shrink-0`} />
                        <span className="font-medium text-white">{selectedCountryObj.name}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                          countryDropdownOpen ? 'rotate-180 text-[#D4AF37]' : ''
                        }`}
                      />
                    </button>

                    {countryDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 max-h-40 bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-xl shadow-2xl overflow-y-auto z-50 py-1 backdrop-blur-xl divide-y divide-white/5">
                        {COUNTRIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setCountry(c.name);
                              setPhonePrefix(c.dial);
                              setCountryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2.5 px-3 py-1.5 text-xs text-left transition-all ${
                              country === c.name
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white font-medium'
                            }`}
                          >
                            <span className={`fi fi-${c.code} rounded-sm shrink-0`} />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-gray-300 mb-0.5 block">
                    {t.phoneLabel} <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-22 sm:w-24">
                      <select
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl px-2 py-1.5 text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all appearance-none cursor-pointer text-center"
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
                      onChange={handlePhoneChange}
                      placeholder={t.phonePlaceholder}
                      maxLength={10}
                      minLength={8}
                      inputMode="numeric"
                      pattern="[0-9]{8,10}"
                      autoComplete="tel-national"
                      className="flex-1 bg-[#121212] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-1.5 text-white text-xs sm:text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-2.5 space-y-1">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  {t.includesTitle}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {includes.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1.5"
                    >
                      <span className="text-xs">{item.icon}</span>
                      <span className="text-[10px] sm:text-[11px] font-medium text-gray-200">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {validationError && (
                <div className="mb-2 p-1.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-center text-[11px] text-rose-400 font-medium">
                  {validationError}
                </div>
              )}

              <button
                type="submit"
                disabled={isCheckingDuplicate}
                className="w-full group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#D4AF37] via-[#f3e5ab] to-[#D4AF37] text-black font-black py-3 px-5 rounded-xl uppercase tracking-wider text-xs sm:text-sm shadow-md hover:opacity-95 transition-all cursor-pointer mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>
                  {isCheckingDuplicate ? 'Verificando datos...' : `${t.proceedToPaymentBtn} — ${course.displayPrice}`}
                </span>
                {!isCheckingDuplicate && (
                  <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>
          </>
        )}

        {step === 'checkout' && (
          <div className="py-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-5">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  {t.securePaymentTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex items-center space-x-1 text-gray-300 hover:text-[#D4AF37] text-sm font-bold transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.back}</span>
              </button>
            </div>

            <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-xl p-4 mb-5 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm sm:text-base">{course.title}</p>
                <p className="text-[11px] text-gray-400 mt-1 font-medium">{t.oneTimePayment}</p>
              </div>
              <div className="text-right">
                <span className="text-[#D4AF37] font-black text-base sm:text-lg">
                  {course.displayPrice}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">
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
                    const currentCountryObj =
                      COUNTRIES.find((c) => c.name === country) || selectedCountryObj;

                    const res = await fetch('/api/paypal/create-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        courseId: course.id || 'faded-mastery-elite-2026',
                        countryCode: currentCountryObj?.code?.toUpperCase() || 'VE',
                        country: currentCountryObj?.name || country || 'Venezuela',
                        fullName: fullName.trim(),
                        email: email.trim(),
                        phone: phoneNumber.trim() ? `${phonePrefix} ${phoneNumber.trim()}` : undefined,
                        priceAmount: course.priceAmount,
                        currency: course.currency,
                      }),
                    });

                    const data = await res.json();
                    if (!res.ok || !data.id) {
                      const msg = data.error || 'No se pudo generar la orden de PayPal';
                      setErrorMessage(msg);
                      throw new Error(msg);
                    }
                    return data.id;
                  } catch (err: any) {
                    console.error('Error al crear orden:', err);
                    setErrorMessage(err?.message || 'Ocurrió un error al conectar con PayPal.');
                    throw err;
                  }
                }}
                onApprove={async (data) => {
                  try {
                    const paymentSourceObj = (data as unknown as Record<string, unknown>).paymentSource as any;
                    const isCard =
                      paymentSourceObj === 'card' ||
                      !!paymentSourceObj?.card ||
                      (data as any).fundingSource === 'card' ||
                      (data as any).fundingSource === 'credit_card';

                    const formattedPhone = phoneNumber.trim() ? `${phonePrefix} ${phoneNumber.trim()}` : null;
                    const certName = fullName.trim() || 'Participante';
                    const userEmail = email.trim();

                    const res = await fetch('/api/paypal/capture-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        orderID: data.orderID,
                        certificateName: certName,
                        email: userEmail,
                        phone: formattedPhone,
                        country: country || 'Venezuela',
                        courseName: course.title,
                        amount: course.priceAmount,
                        currency: course.currency,
                        paymentMethod: isCard ? 'credit_card' : 'paypal',
                      }),
                    });

                    const details = (await res.json()) as {
                      success?: boolean;
                      status?: string;
                      orderID?: string;
                      captureID?: string;
                      payerEmail?: string;
                      payerName?: string;
                      payerPhone?: string | null;
                      payerCountry?: string;
                      amount?: string | number;
                      currency?: string;
                      error?: string;
                    };

                    if (!res.ok) {
                      throw new Error(details.error || 'Error al capturar el pago');
                    }

                    if (details.status === 'COMPLETED') {
                      const finalCertName = certName || details.payerName || 'Participante';
                      const targetEmail = userEmail || details.payerEmail || 'cliente@ferreiraacademy.com';
                      const targetPhone = formattedPhone || details.payerPhone || null;
                      const targetCountry = country || details.payerCountry || 'Venezuela';

                      onClose();

                      if (onPaymentCompleted) {
                        onPaymentCompleted({
                          certificateName: finalCertName,
                          courseName: course.title,
                          email: targetEmail,
                          phone: targetPhone,
                          country: targetCountry,
                        });
                      }
                    } else {
                      throw new Error('El pago no fue completado correctamente.');
                    }
                  } catch (err) {
                    console.error('Error al capturar pago:', err);
                    setErrorMessage(
                      err instanceof Error ? err.message : 'Error al procesar la aprobación del pago.'
                    );
                  }
                }}
                onError={(err) => {
                  console.error('PayPal Buttons Error:', err);
                  setErrorMessage('Ocurrió un error con la pasarela de PayPal.');
                }}
              />
            </div>

            <p className="text-[10px] text-gray-500 text-center mt-3">
              Pago seguro encriptado de nivel 256-bit procesado por PayPal
            </p>
          </div>
        )}
      </div>
    </div>
  );
};