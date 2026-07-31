'use client';

import React from 'react';
import { Language, translations } from '@/lib/translations';
import { Facebook, ShieldCheck } from 'lucide-react';
import { LemonSqueezyLogo } from './LemonSqueezyLogo';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = translations[currentLang].footer;

  const navTranslations: Record<Language, string[]> = {
    es: ['Inicio', 'Beneficios', 'Seminario', 'Testimonios', 'Galería', 'Contacto'],
    en: ['Home', 'Benefits', 'Seminar', 'Testimonials', 'Gallery', 'Contact'],
    pt: ['Início', 'Benefícios', 'Seminário', 'Depoimentos', 'Galeria', 'Contato'],
    it: ['Inizio', 'Benefici', 'Seminario', 'Testimonianze', 'Galleria', 'Contatti'],
    fr: ['Accueil', 'Avantages', 'Séminaire', 'Témoignages', 'Galerie', 'Contact'],
    de: ['Startseite', 'Vorteile', 'Seminar', 'Referenzen', 'Galerie', 'Kontakt'],
  };

  const labels = navTranslations[currentLang];
  const hrefs = ['/#hero', '/#benefits', '/#seminar', '/#testimonials', '/galeria', '/#footer'];

  return (
    <footer id="footer" className="bg-black text-white relative overflow-hidden pt-14 sm:pt-16 pb-10 sm:pb-12 border-t border-[#D4AF37]/30">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 
          Mobile: 1 column (full width each), each section stacked
          sm: 2 columns (logo+desc takes full row, then 2-col for quick links / socials / payments)
          lg: 4 columns (logo 2 spans, quick links, socials, payments)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-gray-800">

          {/* Column 1: Logo & Description — takes 2 cols on lg */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center">
              <img
                src="/Logo_Barra_Superior.png"
                alt="Ferreira Academy"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs font-medium">
              {t.disclaimer}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[#D4AF37] font-extrabold text-xs uppercase tracking-[0.2em]">
              {t.quickLinks}
            </h3>
            <ul className="space-y-2.5">
              {labels.map((label, idx) => (
                <li key={idx}>
                  <a
                    href={hrefs[idx]}
                    className="text-gray-400 hover:text-[#D4AF37] text-xs sm:text-sm font-medium transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Socials */}
          <div className="space-y-4">
            <h3 className="text-[#D4AF37] font-extrabold text-xs uppercase tracking-[0.2em]">
              {t.followUs}
            </h3>
            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {[
              { 
                icon: (
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="5%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="90%" stopColor="#285AEB" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad)" strokeWidth="2" fill="none" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="url(#ig-grad)" strokeWidth="2" fill="none" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-grad)" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ), 
                href: 'https://www.instagram.com/__antonio__ferreira/',
                label: 'Instagram'
              },
              { 
                icon: <Facebook className="w-4.5 h-4.5 fill-[#1877F2] stroke-none" />, 
                href: 'https://www.facebook.com/profile.php?id=1157797953',
                label: 'Facebook'
              },
              { 
                icon: (
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path
                      fill="#FF0000"
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
                    />
                    <polygon
                      fill="#FFFFFF"
                      points="9.545,15.568 15.818,12 9.545,8.432"
                    />
                  </svg>
                ), 
                href: 'https://www.youtube.com/@Antonio_ferreirag',
                label: 'YouTube'
              },
              {
                icon: (
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <g filter="drop-shadow(-1px -1px 0px #00F2FE) drop-shadow(1px 1px 0px #FF0050)">
                      <path 
                        fill="#FFFFFF" 
                        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"
                      />
                    </g>
                  </svg>
                ),
                href: 'https://www.tiktok.com/@antonio_ferreirag',
                label: 'TikTok'
              },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 rounded-lg border border-[#D4AF37]/40 bg-[#121212] flex items-center justify-center hover:border-[#D4AF37] hover:bg-[#1a1a1a] transition-all transform hover:scale-105 shadow-sm"
              >
                {social.icon}
              </a>
            ))}
            </div>
          </div>

          {/* Column 4: Secure Platform & Payments */}
          <div className="space-y-4">
            <h3 className="text-[#D4AF37] font-extrabold text-xs uppercase tracking-[0.2em]">
              {t.securePlatform}
            </h3>
            <p className="text-gray-400 text-xs font-medium">
              {t.paySafely}
            </p>
            <div className="flex items-center flex-wrap gap-2 sm:gap-3 pt-1">
              {/* Lemon Squeezy */}
              <LemonSqueezyLogo size="sm" className="px-2 py-1 rounded border border-white/10 bg-white/5" />
              {/* PayPal */}
              <span className="font-black text-sm tracking-tight bg-white/5 px-2 py-1 rounded border border-white/10">
                <span className="text-[#0079C1]">Pay</span>
                <span className="text-white">Pal</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 pt-1 text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-300">
                {t.globalPlatform}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal links */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-medium gap-4 sm:gap-0">
          <p className="text-center sm:text-left">{t.rights}</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">
              {t.privacy}
            </a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">
              {t.terms}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};