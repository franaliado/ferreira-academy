'use client';

import React from 'react';
import { Language, translations } from '@/lib/translations';
import { Star } from 'lucide-react';

interface TestimonialsProps {
  currentLang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ currentLang }) => {
  const t = translations[currentLang].testimonials;

  const avatarInitials = ['C', 'J', 'A'];
  const flags = ['🇲🇽', '🇨🇴', '🇨🇱'];
  const shortNames = ['Carlos M.', 'Juan P.', 'Andrés L.'];

  return (
    <section id="testimonials" className="py-20 bg-black relative overflow-hidden">
      {/* Top gold separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <div className="flex-1 max-w-[100px] h-px bg-gradient-to-l from-[#D4AF37]/40 to-transparent" />
          <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-[0.12em] text-center">
            {t.sectionHeading}
          </h2>
          <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
        </div>

        {/* 3 Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="border border-[#D4AF37]/25 bg-[#0d0d0d] rounded-xl p-6 space-y-4 hover:border-[#D4AF37]/50 transition-all duration-300 group"
            >
              {/* Stars */}
              <div className="flex space-x-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative">
                <span className="text-[#D4AF37]/30 text-5xl font-serif absolute -top-2 -left-1 leading-none select-none">"</span>
                <p className="text-gray-300 text-sm leading-relaxed pt-4 italic">
                  {item.comment}
                </p>
              </div>

              {/* Author */}
              <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center space-x-3">
                {/* Avatar circle */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#AA7C11]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                  <span className="text-[#D4AF37] text-sm font-bold">{avatarInitials[index]}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{shortNames[index]}</p>
                  <p className="text-gray-500 text-[11px]">{t.countries[index]} {flags[index]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
