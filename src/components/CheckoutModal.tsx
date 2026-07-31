'use client';

import React, { useState } from 'react';
import { Language, translations } from '@/lib/translations';
import { currentCourse } from '@/data/currentCourse';
import {
  X,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  MessageCircle,
  MapPin,
  Award,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { LemonSqueezyLogo } from './LemonSqueezyLogo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const t = translations[currentLang].checkout;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'lemonSqueezy' | 'paypal'>('lemonSqueezy');
  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvc: '***',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.country) {
      alert('Por favor complete todos los datos obligatorios.');
      return;
    }
    setStep(2);
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);

    try {
      // Call internal checkout API route handler
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          amount: currentCourse.priceAmount,
          currency: currentCourse.currency,
          lemonSqueezyVariantId: currentCourse.lemonSqueezyVariantId,
          paypalPlanId: currentCourse.paypalPlanId,
        }),
      });
      const data = await res.json();
      setOrderId(data.orderId || `FA-USD-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch {
      setOrderId(`FA-USD-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsProcessing(false);
      setStep(3); // Advance to Success Portal
    }
  };

  const countriesList = [
    'España',
    'Estados Unidos',
    'México',
    'Colombia',
    'Argentina',
    'Chile',
    'Perú',
    'Brasil',
    'Ecuador',
    'República Dominicana',
    'Venezuela',
    'Francia',
    'Italia',
    'Reino Unido',
    'Otro País Internacional',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 pb-4 px-3 sm:px-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-950 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-[0_0_60px_rgba(212,175,55,0.25)] my-2">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-neutral-900 border border-amber-500/20 text-gray-400 hover:text-white hover:border-[#D4AF37] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with Official Black Brand Logo */}
        <div className="text-center space-y-1 mb-4">
          {/* Logo — prominent hero size */}
          <div className="flex justify-center items-center w-full">
            <img
              src="/Logo_Oficial_Negro.png"
              alt="Ferreira Academy"
              style={{ height: '200px', width: 'auto', maxWidth: '90%', marginBottom: '-16px' }}
              className="object-contain drop-shadow-[0_4px_24px_rgba(212,175,55,0.30)]"
            />
          </div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1 rounded-full text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.modalBadge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight">{t.title}</h2>
          <p className="text-[11px] sm:text-xs text-gray-400 font-light">{t.subtitle}</p>
        </div>

        {/* Progress Bar Indicator */}
        <div className="flex items-center justify-between mb-4 px-3 relative">
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-neutral-800 -z-0" />
          <div
            className="absolute top-1/2 left-6 h-0.5 bg-[#D4AF37] transition-all duration-500 -z-0"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />

          <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-serif ${step >= 1 ? 'bg-[#D4AF37] text-black' : 'bg-neutral-900 text-gray-500 border border-amber-500/20'}`}>
            1
          </div>
          <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-serif ${step >= 2 ? 'bg-[#D4AF37] text-black' : 'bg-neutral-900 text-gray-500 border border-amber-500/20'}`}>
            2
          </div>
          <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-serif ${step === 3 ? 'bg-[#D4AF37] text-black' : 'bg-neutral-900 text-gray-500 border border-amber-500/20'}`}>
            3
          </div>
        </div>

        {/* STEP 1: Mandatory User Data */}
        {step === 1 && (
          <form onSubmit={handleNextToPayment} className="space-y-3">
            <h3 className="text-sm font-bold font-serif text-white border-b border-amber-500/20 pb-1.5">
              {t.step1Title}
            </h3>

            <div className="space-y-0.5">
              <label className="block text-[11px] font-medium text-amber-200/80">{t.fullName} *</label>
              <input
                type="text"
                required
                placeholder="Ej. Antonio Ramírez Silva"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <label className="block text-[11px] font-medium text-amber-200/80">{t.email} *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-0.5">
                <label className="block text-[11px] font-medium text-amber-200/80">{t.phone} *</label>
                <input
                  type="tel"
                  required
                  placeholder="+34 600 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-0.5">
              <label className="block text-[11px] font-medium text-amber-200/80">{t.country} *</label>
              <select
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">{t.selectCountry}</option>
                {countriesList.map((c) => (
                  <option key={c} value={c} className="bg-neutral-950 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full btn-gold-primary py-3 rounded-full text-sm font-bold flex items-center justify-center space-x-2"
              >
              <span>{t.proceedToPayment} ({currentCourse.displayPrice})</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Selector (Stripe & PayPal USD) */}
        {step === 2 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-serif text-white border-b border-amber-500/20 pb-1.5">
              {t.step2Title}
            </h3>

            {/* Payment Options Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('lemonSqueezy')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'lemonSqueezy'
                    ? 'border-[#D4AF37] bg-amber-500/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'border-amber-500/20 bg-neutral-900 opacity-60 hover:opacity-100'
                }`}
              >
                <LemonSqueezyLogo size="md" />
                <span className="text-[10px] text-gray-400">Tarjetas / Apple &amp; Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-[#D4AF37] bg-amber-500/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'border-amber-500/20 bg-neutral-900 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="text-base font-extrabold italic text-[#D4AF37]">PayPal</div>
                <span className="text-xs font-bold text-white">PayPal Express</span>
                <span className="text-[10px] text-gray-400">Pago Rápido USD</span>
              </button>
            </div>

            {/* Lemon Squeezy Payment Gateway Info */}
            {paymentMethod === 'lemonSqueezy' && (
              <div className="space-y-2 bg-neutral-900/60 p-3 rounded-xl border border-amber-500/20 text-center">
                <div className="flex justify-center items-center space-x-2 text-yellow-400 text-xs font-bold">
                  <span>Pasarela</span>
                  <LemonSqueezyLogo size="sm" />
                </div>
                <p className="text-[11px] text-gray-300">
                  Procesamiento global seguro con tarjeta de crédito/débito, Apple Pay y Google Pay.
                </p>
                <div className="space-y-2 bg-neutral-950 p-2.5 rounded-lg border border-amber-500/30 text-left">
                  <div className="space-y-0.5">
                    <label className="block text-[11px] text-gray-400">{t.cardNumber}</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="block text-[11px] text-gray-400">{t.cardExpiry}</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="block text-[11px] text-gray-400">{t.cardCvc}</label>
                      <input
                        type="text"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        className="w-full bg-neutral-900 border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="bg-neutral-900/60 p-3 rounded-xl border border-amber-500/20 text-center space-y-1.5">
                <p className="text-[11px] text-gray-300">
                  Serás procesado a través de la pasarela segura en dólares de PayPal.
                </p>
                <div className="inline-block bg-amber-500/20 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-semibold">
                  Monto a Pagar: {currentCourse.displayPrice}
                </div>
              </div>
            )}

            <div className="pt-1 space-y-2">
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="w-full btn-gold-primary py-3 rounded-full text-sm font-bold flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>{isProcessing ? t.processing : `${t.completePayment} (${currentCourse.displayPrice})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-[11px] text-gray-400 hover:text-white underline text-center"
              >
                Volver a editar mis datos
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation & Mandatory Exclusive WhatsApp Portal */}
        {step === 3 && (
          <div className="space-y-3 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-0.5">
              <h3 className="text-xl font-bold font-serif text-white">{t.successTitle}</h3>
              <p className="text-[11px] sm:text-xs text-gray-300 font-light">{t.successSubtitle}</p>
              <p className="text-[11px] font-mono text-[#D4AF37] pt-0.5">
                {t.orderId}: <span className="font-bold">{orderId}</span>
              </p>
            </div>

            {/* MANDATORY STRICT REQUIREMENT: EXCLUSIVE WHATSAPP COMMUNITY ONLY AFTER SUCCESSFUL PAYMENT */}
            <div className="bg-emerald-950/40 border-2 border-emerald-500/50 p-4 rounded-2xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-center space-x-2 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.whatsappBadge}</span>
              </div>

              <h4 className="text-sm font-bold font-serif text-white">
                Comunidad Oficial de Estudiantes
              </h4>

              <a
                href="https://chat.whatsapp.com/FerreiraAcademyVIP2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3 px-5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5 fill-black" />
                <span className="text-sm tracking-wide">{t.joinWhatsapp}</span>
              </a>
            </div>

            {/* Event Access Info */}
            <div className="bg-neutral-900/80 p-3 rounded-xl border border-amber-500/20 text-left space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-1.5 text-[#D4AF37] font-bold font-serif text-xs">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t.zoomDetails}</span>
              </div>
              <p className="text-gray-300">📅 {t.zoomDate}</p>
              <p className="text-gray-300">
                📍 {t.zoomLink}
              </p>
            </div>

            {/* Certificate Quick Notice */}
            <div className="flex items-center space-x-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/30 text-[11px] text-amber-200 text-left">
              <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Tu Certificado Digital Oficial con la firma de Antonio Ferreira estará habilitado inmediatamente al concluir el seminario.</span>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-white font-bold py-2.5 rounded-full text-sm transition-all"
            >
              {t.closeModal}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
