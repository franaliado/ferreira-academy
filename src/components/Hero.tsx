'use client';

import React, { useEffect, useRef } from 'react';
import { Language, translations } from '@/lib/translations';
import { ChevronRight } from 'lucide-react';

interface HeroProps {
  currentLang: Language;
  onOpenCheckout: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onOpenCheckout }) => {
  const t = translations[currentLang].hero;

  const line1ContainerRef = useRef<HTMLDivElement>(null);
  const line1TextRef = useRef<HTMLSpanElement>(null);
  const line2ContainerRef = useRef<HTMLDivElement>(null);
  const line2TextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const scaleText = (container: HTMLDivElement | null, text: HTMLSpanElement | null) => {
      if (!container || !text) return;
      
      // En pantallas de escritorio (sm en adelante), reseteamos la escala
      if (window.innerWidth >= 640) {
        text.style.transform = 'none';
        text.style.display = 'block';
        return;
      }

      // Resetear para medir el ancho natural real de manera idéntica
      text.style.transform = 'none';
      text.style.display = 'inline-block';
      
      const containerWidth = container.clientWidth;
      const textWidth = text.scrollWidth;

      if (textWidth > 0 && containerWidth > 0) {
        const scaleFactor = containerWidth / textWidth;
        text.style.display = 'block';
        text.style.transformOrigin = 'left center';
        text.style.transform = `scale(${scaleFactor})`;
      }
    };

    const handleResize = () => {
      scaleText(line1ContainerRef.current, line1TextRef.current);
      scaleText(line2ContainerRef.current, line2TextRef.current);
    };

    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    if (line1ContainerRef.current) observer.observe(line1ContainerRef.current);
    if (line2ContainerRef.current) observer.observe(line2ContainerRef.current);

    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [currentLang, t.headline1, t.headline2]);

  const statIcons = [
    (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 sm:w-7 sm:h-7" key="1">
        <rect x="2" y="4" width="15" height="11" rx="2" />
        <path d="M17 8.5l4-3v10l-4-3" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 sm:w-7 sm:h-7" key="2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 sm:w-7 sm:h-7" key="3">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="M9 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 sm:w-7 sm:h-7" key="4">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 010 20a15.3 15.3 0 010-20" />
      </svg>
    ),
  ];

  return (
    <section id="hero" className="relative bg-[#0A0A0A] text-white">
      {/* Background layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right,#D4AF37 1px,transparent 1px),linear-gradient(to bottom,#D4AF37 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-10 sm:pt-32 sm:pb-12 lg:pt-28 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-0">

          {/* LEFT COLUMN */}
          <div className="relative z-30 lg:col-span-7 space-y-5 order-2 lg:order-1">

            {/* Eyebrow text */}
            <div className="space-y-1">
              <p className="text-[#D4AF37] font-extrabold uppercase tracking-widest text-[0.75rem]" style={{ letterSpacing: '0.28em' }}>
                {t.academyLine1}
              </p>
              <p className="text-gray-200 font-bold uppercase tracking-wider text-[0.72rem]" style={{ letterSpacing: '0.18em' }}>
                {t.academyLine2}
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="font-black uppercase leading-tight tracking-tight text-4xl sm:text-5xl lg:text-[2.8rem] xl:text-[3.4rem]">
              
              {/* Line 1 Container */}
              <div ref={line1ContainerRef} className="w-full overflow-hidden block">
                <span 
                  ref={line1TextRef}
                  className="block text-white whitespace-nowrap tracking-tight sm:text-[2.8rem] xl:text-[3.4rem]"
                  style={{ fontSize: '2.25rem' }} 
                >
                  {t.headline1}
                </span>
              </div>

              {/* Line 2 Container — Sin dangerouslySetInnerHTML para medir idéntico */}
              <div ref={line2ContainerRef} className="w-full overflow-hidden block mt-1">
                <span 
                  ref={line2TextRef}
                  className="block gold-gradient-text drop-shadow-lg whitespace-nowrap tracking-tight sm:text-[2.8rem] xl:text-[3.4rem]"
                  style={{ fontSize: '2.25rem' }}
                >
                  {t.headline2}
                </span>
              </div>

            </h1>

            {/* Subtitle */}
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              {t.subtitleText}
            </p>

            {/* 4-stat icon grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-lg pt-1">
              {t.stats.map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-2">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg border border-[#D4AF37]/60 text-[#D4AF37] bg-[#D4AF37]/10">
                    {statIcons[i]}
                  </div>
                  <p className="text-white font-extrabold uppercase leading-tight text-[0.6rem] sm:text-[0.62rem]" style={{ letterSpacing: '0.05em' }}>
                    {s.line1}
                    <br />
                    {s.line2}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={onOpenCheckout}
                id="cta-hero-primary"
                className="group inline-flex items-center justify-center space-x-3 btn-gold-primary cursor-pointer rounded-sm w-full sm:w-auto px-8 sm:px-10 py-4 text-[0.88rem] font-black uppercase tracking-[0.12em]"
              >
                <span>{t.ctaButton}</span>
                <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Payment security row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
              <span className="text-gray-200 font-bold uppercase text-[0.68rem]" style={{ letterSpacing: '0.2em' }}>
                {t.securePayments}
              </span>

              <span className="font-extrabold text-base text-[#8792FF] tracking-tight">stripe</span>

              <span className="font-black text-base tracking-tight">
                <span className="text-[#0079C1]">Pay</span>
                <span className="text-white">Pal</span>
              </span>

              <span className="flex items-center gap-1.5 text-gray-200">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-100 font-bold uppercase text-[0.68rem]" style={{ letterSpacing: '0.12em' }}>
                  SSL SECURE
                </span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative z-10 lg:col-span-5 w-full flex justify-center lg:justify-end items-center order-1 lg:order-2">
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[520px] flex items-center justify-center">
              <img
                src="/Imagen_Antonio.png"
                alt="Antonio Ferreira - Master Barber"
                className="w-full h-auto object-contain lg:scale-110 xl:scale-125 transform"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};