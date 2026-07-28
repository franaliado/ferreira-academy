'use client';

import React, { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';
import { ChevronDown, Menu, X } from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';

const LANG_STORAGE_KEY = 'ferreia_academy_lang';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, onLanguageChange }) => {
  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[currentLang].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languageNames: Record<Language, { label: string; flagCode: string }> = {
    es: { label: 'Español', flagCode: 'es' },
    en: { label: 'English', flagCode: 'us' },
    pt: { label: 'Português', flagCode: 'br' },
    it: { label: 'Italiano', flagCode: 'it' },
    fr: { label: 'Français', flagCode: 'fr' },
    de: { label: 'Deutsch', flagCode: 'de' },
  };

  const navItems = [
    { href: '#hero', label: t.home.toUpperCase() },
    { href: '#seminar', label: t.seminar.toUpperCase() },
    { href: '#benefits', label: t.benefits.toUpperCase() },
    { href: '#testimonials', label: t.instructor.toUpperCase() },
    { href: '#footer', label: t.faq.toUpperCase() },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/96 backdrop-blur-md border-b border-[#D4AF37]/20 py-2 shadow-[0_4px_30px_rgba(0,0,0,0.9)]'
          : 'bg-black py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <a href="#hero" className="flex items-center shrink-0 group py-1">
            <img 
              src="/Logo_Barra_Superior.png" 
              alt="Ferreira Academy" 
              className="w-44 md:w-56 h-auto object-contain py-1" 
            />
          </a>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-[#D4AF37] transition-colors duration-200 group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-2 border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-black/60 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all duration-200 shadow-sm"
                aria-label="Select Language"
              >
                <span className={`fi fi-${languageNames[currentLang].flagCode} rounded-sm shrink-0`} />
                <span className="font-semibold text-xs text-white">{languageNames[currentLang].label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-200" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-xl shadow-2xl overflow-hidden z-50 py-1 backdrop-blur-xl">
                  {(['es', 'en', 'pt', 'it', 'fr', 'de'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        localStorage.setItem(LANG_STORAGE_KEY, lang);
                        onLanguageChange(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-xs text-left transition-all ${
                        currentLang === lang
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-extrabold'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white font-medium'
                      }`}
                    >
                      <span className={`fi fi-${languageNames[lang].flagCode} rounded-sm shrink-0`} />
                      <span>{languageNames[lang].label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-[#D4AF37] transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/98 border-t border-[#D4AF37]/20 px-6 py-6 space-y-4">
          <div className="flex justify-center pb-2 border-b border-white/10">
            <img
              src="/Logo_Sticky_Nav.png"
              alt="Ferreira Academy"
              className="h-10 w-auto"
            />
          </div>
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest text-gray-200 hover:text-[#D4AF37] transition-colors py-1.5 border-b border-white/5"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
