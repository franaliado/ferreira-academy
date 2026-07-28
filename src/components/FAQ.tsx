'use client';

import React, { useState } from 'react';
import { Language, translations } from '@/lib/translations';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQProps {
  currentLang: Language;
}

export const FAQ: React.FC<FAQProps> = ({ currentLang }) => {
  const t = translations[currentLang].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white">
            {t.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg font-light">
            {t.subtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {t.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="gold-glass-card rounded-2xl overflow-hidden border border-amber-500/20 transition-all"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-white font-serif">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-gray-300 font-light leading-relaxed border-t border-amber-500/10 bg-neutral-950/40">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
