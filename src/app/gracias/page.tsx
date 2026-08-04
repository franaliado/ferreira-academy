'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

export default function GraciasPage() {
  const WHATSAPP_LINK = 'https://chat.whatsapp.com/DYZZgiY5rm4Imls1wGIZzy?s=cl&p=a&ilr=1';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redireccionar automáticamente cuando el contador llegue a 0
    if (countdown <= 0) {
      window.location.href = WHATSAPP_LINK;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleManualRedirect = () => {
    window.location.href = WHATSAPP_LINK;
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col justify-between relative overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Logo */}
      <header className="w-full py-6 px-6 max-w-7xl mx-auto flex justify-center sm:justify-start items-center relative z-10">
        <img
          src="/Logo_Oficial_Negro.png"
          alt="Ferreira Academy"
          className="h-16 w-auto object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]"
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="max-w-xl w-full text-center space-y-8 bg-neutral-950/80 border-2 border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(212,175,55,0.15)] backdrop-blur-md">
          
          {/* Animated Success Badge */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl scale-125 animate-pulse" />
              <div className="relative bg-gradient-to-tr from-amber-600 to-yellow-400 p-4 rounded-full shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-black stroke-[2.5]" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span>¡Pago Confirmado Exitosamente!</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wide leading-none">
              ¡Tu cupo está <span className="text-[#D4AF37]">asegurado</span>!
            </h1>
            <p className="text-sm text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
              Gracias por registrarte en el Seminario Internacional de Barbería. Hemos procesado tu pago correctamente.
            </p>
          </div>

          {/* WhatsApp Section */}
          <div className="bg-neutral-900/60 border border-amber-500/15 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <MessageSquare className="w-5 h-5 fill-green-400/20" />
              <span className="text-xs font-extrabold uppercase tracking-wider">Paso Final Obligatorio</span>
            </div>
            <p className="text-xs text-gray-300">
              Únete a la comunidad de WhatsApp del seminario para recibir el link de acceso a las clases en vivo, material de apoyo y actualizaciones importantes.
            </p>
            
            {/* CTA Button */}
            <button
              onClick={handleManualRedirect}
              className="w-full bg-gradient-to-r from-amber-500 via-[#D4AF37] to-yellow-400 text-black py-4 px-6 rounded-xl text-sm font-black uppercase tracking-[0.12em] flex items-center justify-center space-x-3 cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>Acceder al Grupo Ahora</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Countdown / Redirect status */}
            <div className="text-[11px] text-gray-500 font-medium">
              Redireccionando automáticamente al grupo en <span className="text-amber-400 font-bold">{countdown} segundos</span>...
            </div>
          </div>

          <div className="text-[10px] text-gray-600 font-light">
            ¿No fuiste redireccionado? Haz clic en el botón de arriba para ingresar manualmente.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 text-center text-xs text-gray-500 relative z-10 border-t border-neutral-900 mt-8">
        &copy; {new Date().getFullYear()} Ferreira Academy. Todos los derechos reservados.
      </footer>
    </div>
  );
}
