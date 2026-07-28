'use client';

import React from 'react';
import Image from 'next/image';
import { Language, translations } from '@/lib/translations';
import { Award, Users, Globe2, Sparkles } from 'lucide-react';

interface InstructorProps {
  currentLang: Language;
}

export const Instructor: React.FC<InstructorProps> = ({ currentLang }) => {
  const t = translations[currentLang].instructor;

  return (
    <section id="instructor" className="py-24 bg-neutral-950 relative overflow-hidden border-t border-amber-500/10">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white">
            {t.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg font-light">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Official Photo in Luxury Presentation Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden gold-glass-card p-3">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/Foto_Oficial_Antonio_Ferreira.png"
                  alt="Antonio Ferreira"
                  fill
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Metrics & Signature */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-gray-300 font-light text-base sm:text-lg leading-relaxed">
              <p className="border-l-2 border-[#D4AF37] pl-4 italic text-white/90">
                "{t.bio1}"
              </p>
              <p>{t.bio2}</p>
            </div>

            {/* Metrics Counter Grid */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-amber-500/20">
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-1 text-[#D4AF37]">
                  <Award className="w-5 h-5" />
                  <span className="text-2xl sm:text-3xl font-extrabold font-serif text-white">{t.stat1Value}</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{t.stat1Label}</p>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-1 text-[#D4AF37]">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl sm:text-3xl font-extrabold font-serif text-white">{t.stat2Value}</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{t.stat2Label}</p>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start space-x-1 text-[#D4AF37]">
                  <Globe2 className="w-5 h-5" />
                  <span className="text-2xl sm:text-3xl font-extrabold font-serif text-white">{t.stat3Value}</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{t.stat3Label}</p>
              </div>
            </div>

            {/* Official Signature Section */}
            <div className="pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div>
                <p className="text-xs text-amber-300/80 font-medium uppercase tracking-widest">
                  {t.signatureLabel}
                </p>
                <p className="text-sm font-semibold text-white font-serif mt-1">Antonio Ferreira</p>
              </div>
              <div className="relative h-16 w-48 bg-neutral-900/60 rounded-xl border border-amber-500/20 p-2 flex items-center justify-center backdrop-blur-sm">
                <Image
                  src="/Firma_Antonio_Ferreira.png"
                  alt="Firma Oficial Antonio Ferreira"
                  fill
                  className="object-contain p-1 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
