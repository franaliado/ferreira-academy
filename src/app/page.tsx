'use client';

import React, { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Benefits } from '@/components/Benefits';
import { SeminarDetails } from '@/components/SeminarDetails';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ChevronRight } from 'lucide-react';

const LANG_STORAGE_KEY = 'ferreia_academy_lang';

/** Maps a navigator.language prefix to one of our 6 supported languages. */
function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'es';

  // 1. Honour previously saved user preference
  const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
  if (saved && ['es', 'en', 'pt', 'it', 'fr', 'de'].includes(saved)) return saved;

  // 2. Detect from browser language
  const lang = (navigator.language || '').toLowerCase();

  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('it')) return 'it';
  if (lang.startsWith('pt')) return 'pt';
  if (lang.startsWith('en')) return 'en';
  // Spanish variants: es-ES, es-MX, es-AR, es-CO …
  if (lang.startsWith('es')) return 'es';

  // 3. Fallback to Spanish
  return 'es';
}

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Language>('es');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Detect language on first render (client-side only)
  useEffect(() => {
    setCurrentLang(detectLanguage());
  }, []);

  /** Persist user's manual selection and update state */
  const handleLanguageChange = (lang: Language) => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    setCurrentLang(lang);
  };

  const handleOpenCheckout = () => setIsCheckoutOpen(true);
  const handleCloseCheckout = () => setIsCheckoutOpen(false);

  const t = translations[currentLang];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* Fixed Header */}
      <Header currentLang={currentLang} onLanguageChange={handleLanguageChange} />

      <main>
        {/* 1. Hero Section */}
        <Hero currentLang={currentLang} onOpenCheckout={handleOpenCheckout} />

        {/* 2. Benefits — 6 golden icon cards */}
        <Benefits currentLang={currentLang} />

        {/* 3. Seminar Details — 3-column layout */}
        <SeminarDetails currentLang={currentLang} onOpenCheckout={handleOpenCheckout} />

        {/* 4. Testimonials */}
        <Testimonials currentLang={currentLang} />

        {/* 5. Final CTA Banner */}
        <section className="relative py-20 bg-black overflow-hidden">
          {/* Decorative golden glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] bg-amber-800/10 rounded-full blur-3xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wide leading-tight">
              {t.cta.bannerTitlePart1}{' '}
              <span className="text-[#D4AF37]">{t.cta.bannerTitlePart2}</span>
            </h2>
            <p className="text-gray-200 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
              {t.cta.bannerSubtitle}
            </p>
            <button
              onClick={handleOpenCheckout}
              id="cta-final-banner"
              className="group inline-flex items-center space-x-3 btn-gold-primary px-10 py-4 rounded text-sm font-black uppercase tracking-[0.12em] cursor-pointer mt-4"
            >
              <span>{t.cta.button}</span>
              <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        currentLang={currentLang}
      />
    </div>
  );
}