'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Language, translations } from '@/lib/translations';
import { Award, Download, ShieldCheck, QrCode } from 'lucide-react';

interface CertificatePreviewProps {
  currentLang: Language;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({ currentLang }) => {
  const t = translations[currentLang].certificate;
  const [studentName, setStudentName] = useState('MARCOS A. BENÍTEZ');

  const handleDownloadSample = () => {
    // Triggers print dialog formatted as certificate or mock sample file
    window.print();
  };

  return (
    <section id="certificate" className="py-24 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white">
            {t.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg font-light">
            {t.subtitle}
          </p>
        </div>

        {/* Live Name Input Control */}
        <div className="max-w-md mx-auto mb-12 space-y-2">
          <label className="block text-xs font-medium text-amber-200 uppercase tracking-wider text-center">
            {t.nameInputLabel}
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder={t.placeholderName}
            className="w-full bg-neutral-900 border border-amber-500/40 rounded-full px-5 py-3 text-center text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-serif"
          />
        </div>

        {/* High-End Interactive Certificate Visual (Aligned with Certificado_Referencia.png) */}
        <div className="max-w-4xl mx-auto gold-glass-card p-4 sm:p-8 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.2)]">
          
          <div className="bg-[#FAF8F5] text-neutral-900 rounded-2xl p-6 sm:p-12 relative border-8 border-double border-[#D4AF37] shadow-2xl print:border-none print:shadow-none font-serif">
            
            {/* Corner Gold Ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]" />

            {/* Certificate Header */}
            <div className="text-center space-y-4">
              <div className="relative h-16 w-48 mx-auto">
                <Image
                  src="/Logo_Oficial_Negro.png"
                  alt="Ferreira Academy Official Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-800">
                  FERREIRA ACADEMY • INTERNATIONAL EDUCATION
                </p>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-wider text-black font-serif">
                  CERTIFICADO DE ACREDITACIÓN
                </h3>
              </div>
            </div>

            {/* Recipient Name */}
            <div className="my-8 text-center space-y-3">
              <p className="text-xs uppercase tracking-widest text-neutral-600 font-sans">
                OTORGADO A FAVOR DE:
              </p>
              <div className="border-b-2 border-amber-600/40 pb-2 inline-block max-w-full px-8">
                <p className="text-2xl sm:text-4xl font-bold font-serif text-amber-950 uppercase tracking-wide">
                  {studentName || 'NOMBRE Y APELLIDO'}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-700 text-center max-w-2xl mx-auto font-sans leading-relaxed">
              Por haber completado satisfactoriamente el Seminario Internacional de Alta Barbería y Corte Masculino de Elite (8 Horas Lectivas), demostrando el dominio de técnicas avanzadas de visagismo, tijera ejecutiva y degradados de precisión.
            </p>

            {/* Footer with Signature & Verification Stamp */}
            <div className="mt-10 pt-6 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* QR Verification Mock */}
              <div className="flex items-center space-x-3 text-left">
                <div className="w-12 h-12 bg-neutral-900 p-1.5 rounded-lg flex items-center justify-center text-[#D4AF37]">
                  <QrCode className="w-9 h-9" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-800 font-sans">
                    VERIFICACIÓN DIGITAL
                  </p>
                  <p className="text-[9px] text-neutral-500 font-mono">ID: FA-2026-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
              </div>

              {/* Signature Section */}
              <div className="text-center">
                <div className="relative h-14 w-44 mx-auto mb-1">
                  <Image
                    src="/Firma_Antonio_Ferreira.png"
                    alt="Firma Antonio Ferreira"
                    fill
                    className="object-contain filter drop-shadow-md"
                  />
                </div>
                <div className="border-t border-amber-900/40 pt-1 w-48 mx-auto">
                  <p className="text-xs font-bold text-black font-serif">Antonio Ferreira</p>
                  <p className="text-[10px] text-amber-900 font-sans">{t.titleRole}</p>
                </div>
              </div>

            </div>

          </div>

          {/* Action Download Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-200 px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-lg hover:border-[#D4AF37]"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.downloadPdf}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
