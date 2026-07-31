'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, translations } from '@/lib/translations';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const LANG_STORAGE_KEY = 'ferreia_academy_lang';

function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'es';
  const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
  if (saved && ['es', 'en', 'pt', 'it', 'fr', 'de'].includes(saved)) return saved;
  const lang = (navigator.language || '').toLowerCase();
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('it')) return 'it';
  if (lang.startsWith('pt')) return 'pt';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('es')) return 'es';
  return 'es';
}

const galleryTranslations: Record<Language, {
  title: string;
  subtitle: string;
  backText: string;
  items: Array<{ title: string; category: string; src: string }>;
}> = {
  es: {
    title: 'Galería de Arte y Estilo',
    subtitle: 'Explora los trabajos exclusivos de Ferreira Academy',
    backText: 'Regresar',
    items: [
      { title: 'Técnica de Fade Avanzada', category: 'Corte de Precisión', src: '/galeria/imagen-1.png' },
      { title: 'Geometría y Estructura Craneal', category: 'Seminario Presencial', src: '/galeria/Screenshot_88.png' },
      { title: 'Styling y Texturizado Premium', category: 'Acabados', src: '/galeria/imagen-1.png' },
      { title: 'Masterclass en Vivo 2026', category: 'Eventos', src: '/galeria/Screenshot_88.png' },
      { title: 'Perfilado Clásico & Barboterapia', category: 'Barba de Lujo', src: '/galeria/imagen-1.png' },
      { title: 'Graduados Ferreira Academy', category: 'Certificación', src: '/galeria/Screenshot_88.png' },
    ]
  },
  en: {
    title: 'Art & Style Gallery',
    subtitle: 'Explore the exclusive works of Ferreira Academy',
    backText: 'Go Back',
    items: [
      { title: 'Advanced Fade Technique', category: 'Precision Cut', src: '/galeria/imagen-1.png' },
      { title: 'Geometry & Cranial Structure', category: 'In-person Seminar', src: '/galeria/Screenshot_88.png' },
      { title: 'Premium Styling & Texturing', category: 'Finishes', src: '/galeria/imagen-1.png' },
      { title: 'Live Masterclass 2026', category: 'Events', src: '/galeria/Screenshot_88.png' },
      { title: 'Classic Profiling & Beard Therapy', category: 'Luxury Beard', src: '/galeria/imagen-1.png' },
      { title: 'Ferreira Academy Graduates', category: 'Certification', src: '/galeria/Screenshot_88.png' },
    ]
  },
  pt: {
    title: 'Galeria de Arte e Estilo',
    subtitle: 'Explore os trabalhos exclusivos da Ferreira Academy',
    backText: 'Voltar',
    items: [
      { title: 'Técnica de Fade Avançada', category: 'Corte de Precisão', src: '/galeria/imagen-1.png' },
      { title: 'Geometria e Estrutura Cranial', category: 'Seminário Presencial', src: '/galeria/Screenshot_88.png' },
      { title: 'Styling e Texturização Premium', category: 'Acabamentos', src: '/galeria/imagen-1.png' },
      { title: 'Masterclass ao Vivo 2026', category: 'Eventos', src: '/galeria/Screenshot_88.png' },
      { title: 'Perfilamento Clássico & Barboterapia', category: 'Barba de Luxo', src: '/galeria/imagen-1.png' },
      { title: 'Graduados Ferreira Academy', category: 'Certificação', src: '/galeria/Screenshot_88.png' },
    ]
  },
  it: {
    title: 'Galleria d\'Arte e Stile',
    subtitle: 'Esplora i lavori esclusivi di Ferreira Academy',
    backText: 'Indietro',
    items: [
      { title: 'Tecnica di Fade Avanzata', category: 'Taglio di Precisione', src: '/galeria/imagen-1.png' },
      { title: 'Geometria e Struttura Craniale', category: 'Seminario in Presenza', src: '/galeria/Screenshot_88.png' },
      { title: 'Styling e Texturizzazione Premium', category: 'Finiture', src: '/galeria/imagen-1.png' },
      { title: 'Masterclass dal Vivo 2026', category: 'Eventi', src: '/galeria/Screenshot_88.png' },
      { title: 'Modellatura Classica e Barba Therapy', category: 'Barba di Lusso', src: '/galeria/imagen-1.png' },
      { title: 'Laureati Ferreira Academy', category: 'Certificazione', src: '/galeria/Screenshot_88.png' },
    ]
  },
  fr: {
    title: 'Galerie d\'Art et de Style',
    subtitle: 'Explorez les travaux exclusifs de Ferreira Academy',
    backText: 'Retour',
    items: [
      { title: 'Technique de Fade Avancée', category: 'Coupe de Précision', src: '/galeria/imagen-1.png' },
      { title: 'Géométrie et Structure Crânienne', category: 'Séminaire Présentiel', src: '/galeria/Screenshot_88.png' },
      { title: 'Styling et Texturisation Premium', category: 'Finitions', src: '/galeria/imagen-1.png' },
      { title: 'Masterclass en Direct 2026', category: 'Événements', src: '/galeria/Screenshot_88.png' },
      { title: 'Rasage Classique & Thérapie de Barbe', category: 'Barbe de Luxe', src: '/galeria/imagen-1.png' },
      { title: 'Diplômés Ferreira Academy', category: 'Certification', src: '/galeria/Screenshot_88.png' },
    ]
  },
  de: {
    title: 'Kunst & Stil Galerie',
    subtitle: 'Entdecken Sie die exklusiven Arbeiten der Ferreira Academy',
    backText: 'Zurück',
    items: [
      { title: 'Fortgeschrittene Fade-Technik', category: 'Präzisionsschnitt', src: '/galeria/imagen-1.png' },
      { title: 'Geometrie & Schädelstruktur', category: 'Präsenzseminar', src: '/galeria/Screenshot_88.png' },
      { title: 'Premium-Styling & Texturierung', category: 'Finishes', src: '/galeria/imagen-1.png' },
      { title: 'Live-Masterclass 2026', category: 'Veranstaltungen', src: '/galeria/Screenshot_88.png' },
      { title: 'Klassisches Bart-Profiling & Therapie', category: 'Luxusbart', src: '/galeria/imagen-1.png' },
      { title: 'Ferreira Academy Absolventen', category: 'Zertifizierung', src: '/galeria/Screenshot_88.png' },
    ]
  }
};

export default function GalleryPage() {
  const [currentLang, setCurrentLang] = useState<Language>('es');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setCurrentLang(detectLanguage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
  };

  // Scroll reveal Intersection Observer
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal, .reveal-scale');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentLang]);

  const gt = galleryTranslations[currentLang] || galleryTranslations['es'];

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % gt.items.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + gt.items.length) % gt.items.length : null));
      } else if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, gt.items.length]);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col">
      {/* Navigation Header */}
      <Header currentLang={currentLang} onLanguageChange={handleLanguageChange} />

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="relative flex flex-col items-center justify-center text-center space-y-4 mb-10 reveal">
          
          {/* Back Button Container - aligned left, placed above the title */}
          <div className="w-full flex justify-start pt-2">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900 border border-amber-500/30 text-xs sm:text-sm font-bold font-serif text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] active:scale-95 z-20"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>{gt.backText}</span>
            </Link>
          </div>

          {/* Title Container - perfectly centered */}
          <div className="w-full border-b border-amber-500/20 pb-4">
            <h1 className="text-3xl sm:text-5xl font-black font-serif uppercase leading-tight tracking-tight bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#CFA23A] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(212,175,55,0.35)] animate-shimmer text-center">
              {gt.title}
            </h1>
          </div>

          <p className="text-white text-sm sm:text-base max-w-xl mx-auto font-medium w-full text-center">
            {gt.subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gt.items.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square overflow-hidden border border-amber-500/20 hover:border-[#D4AF37]/80 rounded-xl relative group transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.05)] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] reveal stagger-${(index % 3) + 1} cursor-pointer`}
            >
              {/* Photo or Video preview */}
              {/\.(mp4|webm|ogg|mov)$/i.test(item.src) ? (
                <video
                  src={item.src}
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              {/* Overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-1.5">
                  {item.category}
                </span>
                <h3 className="text-white text-base sm:text-lg font-bold font-serif leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Lightbox / Visor de Imágenes a Pantalla Completa (con Carrusel) */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 select-none"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-900 border border-amber-500/30 text-[#D4AF37] hover:text-white hover:border-[#D4AF37] hover:bg-neutral-800 transition-all z-50 cursor-pointer shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Left Navigation Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev !== null ? (prev - 1 + gt.items.length) % gt.items.length : null));
            }}
            className="absolute left-4 md:left-8 p-3 rounded-full bg-neutral-900/80 border border-amber-500/30 text-[#D4AF37] hover:text-white hover:border-[#D4AF37] hover:bg-neutral-800 transition-all z-50 cursor-pointer shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image/Video Container */}
          <div 
            className="relative max-w-4xl w-full max-h-[80vh] flex flex-col items-center justify-center transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/\.(mp4|webm|ogg|mov)$/i.test(gt.items[selectedIndex].src) ? (
              <video
                src={gt.items[selectedIndex].src}
                autoPlay
                controls
                loop
                playsInline
                className="max-w-full max-h-[70vh] object-contain rounded-lg border border-amber-500/30 shadow-[0_0_50px_rgba(212,175,55,0.25)]"
              />
            ) : (
              <img
                src={gt.items[selectedIndex].src}
                alt={gt.items[selectedIndex].title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg border border-amber-500/30 shadow-[0_0_50px_rgba(212,175,55,0.25)] select-none pointer-events-none"
              />
            )}
            {/* Details overlay below the media */}
            <div className="mt-4 text-center max-w-lg">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                {gt.items[selectedIndex].category}
              </span>
              <h3 className="text-white text-lg font-bold font-serif mt-1">
                {gt.items[selectedIndex].title}
              </h3>
            </div>
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev !== null ? (prev + 1) % gt.items.length : null));
            }}
            className="absolute right-4 md:right-8 p-3 rounded-full bg-neutral-900/80 border border-amber-500/30 text-[#D4AF37] hover:text-white hover:border-[#D4AF37] hover:bg-neutral-800 transition-all z-50 cursor-pointer shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
