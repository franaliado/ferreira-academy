'use client';

import React, { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  currentLang: Language;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, currentLang }) => {
  const t = translations[currentLang].countdown || {
    title: 'EL PRÓXIMO SEMINARIO EN VIVO INICIA EN:',
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    expired: '¡EL CURSO ESTÁ POR COMENZAR! ÚLTIMOS CUPOS DISPONIBLES',
  };

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) return null;

  const isExpired =
    timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="w-full bg-gradient-to-r from-neutral-950 via-amber-950/30 to-neutral-950 border-y border-[#D4AF37]/30 py-6 px-4 sm:px-8 shadow-2xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-[#D4AF37] rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Title Badge & Header */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/50 rounded-xl text-[#D4AF37] shrink-0 hidden sm:block animate-pulse">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4AF37]/20 text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37]/40 mb-1">
              ⚡ OPORTUNIDAD LIMITADA
            </span>
            <h3 className="text-white text-base sm:text-lg font-black uppercase tracking-wider leading-snug">
              {t.title}
            </h3>
          </div>
        </div>

        {/* Counter Grid */}
        {!isExpired ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full md:w-auto">
            {[
              { label: t.days, value: timeLeft.days },
              { label: t.hours, value: timeLeft.hours },
              { label: t.minutes, value: timeLeft.minutes },
              { label: t.seconds, value: timeLeft.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 bg-neutral-900/90 border border-[#D4AF37]/40 rounded-xl min-w-[65px] sm:min-w-[85px] text-center shadow-lg transform transition-all hover:scale-105 hover:border-[#D4AF37]"
              >
                <span className="text-2xl sm:text-3xl font-black font-mono gold-gradient-text leading-none">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[11px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#D4AF37]/20 border border-[#D4AF37] px-6 py-3 rounded-xl text-center">
            <p className="text-[#D4AF37] font-black text-sm sm:text-base uppercase tracking-wider">
              {t.expired}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
