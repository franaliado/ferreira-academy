'use client';

import React from 'react';
import { Language, translations } from '@/lib/translations';
import { Calendar, Video, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

interface SeminarDetailsProps {
  currentLang: Language;
  onOpenCheckout: () => void;
}

export const SeminarDetails: React.FC<SeminarDetailsProps> = ({ currentLang, onOpenCheckout }) => {
  const t = translations[currentLang].seminar;

  return (
    <section id="seminar" className="py-0 bg-black relative overflow-hidden">
      {/* Top gold separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[520px]">

          {/* Column 1: Course Photo */}
          <div className="relative overflow-hidden lg:rounded-none" style={{ minHeight: '420px' }}>
            <img
              src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1200"
              alt="Demostración de corte de cabello masculino profesional"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle side shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Column 2: Course Info */}
          <div className="bg-black border-l border-r border-[#D4AF37]/20 px-8 sm:px-10 py-12 flex flex-col justify-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2">
              <div className="w-8 h-px bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em]">
                {t.liveBadge}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black uppercase leading-tight">
              <span>{t.courseTitleLine1}</span>
              <br />
              <span>{t.courseTitleLine2}</span>
            </h2>

            {/* Checklist */}
            <ul className="space-y-2.5">
              {t.checklist.map((item, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-gray-200 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Specs + CTA */}
          <div className="bg-[#0a0a0a] px-8 sm:px-10 py-12 flex flex-col justify-center space-y-6">

            {/* Date */}
            <div className="flex items-start space-x-4">
              <div className="p-2.5 border border-[#D4AF37]/40 rounded-lg shrink-0">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{t.dateLabel}</p>
                <p className="text-white text-xl font-black uppercase tracking-wide">{t.dateValue}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#D4AF37]/15" />

            {/* Duration */}
            <div className="flex items-start space-x-4">
              <div className="p-2.5 border border-[#D4AF37]/40 rounded-lg shrink-0">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{t.durationLabel}</p>
                <p className="text-white text-xl font-black uppercase tracking-wide">{t.durationValue}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#D4AF37]/15" />

            {/* Modality */}
            <div className="flex items-start space-x-4">
              <div className="p-2.5 border border-[#D4AF37]/40 rounded-lg shrink-0">
                <Video className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{t.modalityLabel}</p>
                <p className="text-white text-xl font-black uppercase tracking-wide">{t.modalityValue}</p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onOpenCheckout}
              id="cta-seminar-secondary"
              className="group w-full btn-gold-primary py-4 rounded text-sm font-black uppercase tracking-[0.12em] flex items-center justify-center space-x-3 cursor-pointer mt-2"
            >
              <span>{t.ctaButton}</span>
              <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};