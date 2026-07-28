'use client';

import React from 'react';
import { Language, translations } from '@/lib/translations';
import { Scissors, Monitor, TrendingUp, Globe, Award, Headphones } from 'lucide-react';

interface BenefitsProps {
  currentLang: Language;
}

export const Benefits: React.FC<BenefitsProps> = ({ currentLang }) => {
  const t = translations[currentLang].benefits;

  const icons = [
    <Scissors key="1" className="w-7 h-7 text-[#D4AF37]" />,
    <Monitor key="2" className="w-7 h-7 text-[#D4AF37]" />,
    <TrendingUp key="3" className="w-7 h-7 text-[#D4AF37]" />,
    <Globe key="4" className="w-7 h-7 text-[#D4AF37]" />,
    <Award key="5" className="w-7 h-7 text-[#D4AF37]" />,
    <Headphones key="6" className="w-7 h-7 text-[#D4AF37]" />,
  ];

  return (
    <section id="benefits" className="py-20 bg-black relative overflow-hidden">
      {/* Top gold separator line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      {/* Bottom gold separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <h2 className="text-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-14">
          {t.sectionHeading}
        </h2>

        {/* 6 Benefits grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {t.items.slice(0, 6).map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-5 rounded-xl border border-[#D4AF37]/25 bg-[#0f0f0f] hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all duration-300 space-y-3"
            >
              {/* Icon container */}
              <div className="w-14 h-14 rounded-lg border border-[#D4AF37]/40 bg-black flex items-center justify-center group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all duration-300">
                {icons[index]}
              </div>

              {/* Short bold title */}
              <h3 className="text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider leading-tight whitespace-pre-line group-hover:text-[#D4AF37] transition-colors">
                {t.shortTitles[index]}
              </h3>

              {/* Description */}
              <p className="text-gray-200 text-[10px] sm:text-xs leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
