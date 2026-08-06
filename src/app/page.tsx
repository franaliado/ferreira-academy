'use client';

import React, { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Benefits } from '@/components/Benefits';
import { SeminarDetails } from '@/components/SeminarDetails';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import { EnrollmentModal } from '@/components/EnrollmentModal';
import { CertificateModal } from '@/components/CertificateModal';
import type { PaymentCaptureData } from '@/components/CertificateModal';

import { ChevronRight, AlertCircle } from 'lucide-react';

const LANG_STORAGE_KEY = 'ferreia_academy_lang';

/** Maps a navigator.language prefix to one of our 6 supported languages. */
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

/** Applies .is-visible to all .reveal* elements as they enter the viewport */
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );
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
  }, []);
}

/** Parallax scroll effect — moves decorated elements at different speeds */
function useParallax() {
  useEffect(() => {
    let rafId: number;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;

        document.querySelectorAll<HTMLElement>('.parallax-slow').forEach((el) => {
          el.style.transform = `translateY(${y * -0.08}px)`;
        });

        document.querySelectorAll<HTMLElement>('.parallax-medium').forEach((el) => {
          el.style.transform = `translateY(${y * -0.14}px)`;
        });

        document.querySelectorAll<HTMLElement>('.parallax-fast').forEach((el) => {
          el.style.transform = `translateY(${y * -0.22}px)`;
        });

        document.querySelectorAll<HTMLElement>('.parallax-bg').forEach((el) => {
          el.style.transform = `translateY(${y * -0.06}px)`;
        });
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);
}

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Language>('es');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'cancel' | 'error';
    text: string;
  } | null>(null);

  // Certificate modal state — opened after a COMPLETED PayPal payment
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [captureData, setCaptureData] = useState<PaymentCaptureData | null>(null);

  useEffect(() => {
    setCurrentLang(detectLanguage());
  }, []);

  useScrollReveal();
  useParallax();

  // Escuchar el retorno del Checkout oficial de PayPal
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const paypalStatus = searchParams.get('paypal_status');
    const token = searchParams.get('token');

    if (paypalStatus === 'success' && token) {
      // Capture the order and then open the CertificateModal
      fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: token }),
      })
        .then((res) => res.json())
        .then((captureResult) => {
          if (captureResult.status === 'COMPLETED') {
            console.log('--- PAGO APROBADO EXITOSAMENTE (redirect flow) ---');
            console.log('Order ID:', captureResult.orderID);

            const data: PaymentCaptureData = {
              orderID: captureResult.orderID || token,
              captureID: captureResult.captureID,
              payerName: captureResult.payerName || '',
              payerEmail: captureResult.payerEmail || '',
              payerPhone: captureResult.payerPhone || null,
              payerCountry: captureResult.payerCountry || 'N/A',
              // In redirect flow we cannot detect card vs paypal reliably, default to paypal
              paymentMethod: 'paypal',
              amount: captureResult.amount || '95.00',
              currency: captureResult.currency || 'USD',
              payerID: captureResult.payerID || '',
            };
            setCaptureData(data);
            setIsCertModalOpen(true);
          } else {
            console.error('Error al capturar la orden:', captureResult);
            setNotification({
              type: 'error',
              text: 'Ocurrió un error al verificar el pago.',
            });
          }
        })
        .catch((err) => {
          console.error('Error en captura de pago PayPal:', err);
          setNotification({
            type: 'error',
            text: 'Ocurrió un error con el Checkout de PayPal.',
          });
        })
        .finally(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    } else if (paypalStatus === 'cancel') {
      console.log('Checkout de PayPal cancelado.');
      setNotification({
        type: 'cancel',
        text: 'El pago fue cancelado.',
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    setCurrentLang(lang);
  };

  const handleOpenCheckout = () => setIsCheckoutOpen(true);
  const handleCloseCheckout = () => setIsCheckoutOpen(false);

  /** Called by EnrollmentModal when PayPal payment is COMPLETED */
  const handlePaymentCompleted = (data: PaymentCaptureData) => {
    setCaptureData(data);
    setIsCertModalOpen(true);
  };

  const handleCloseCertModal = () => {
    setIsCertModalOpen(false);
    setCaptureData(null);
  };

  const t = translations[currentLang];

  return (
    <div
      className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black relative"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Banner de notificación flotante tras retorno cancelado o error de PayPal */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md animate-fade-in">
          <div
            className={`p-4 rounded-xl shadow-2xl flex items-center justify-between space-x-3 border backdrop-blur-md ${
              notification.type === 'cancel'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-300'
                : 'bg-rose-950/90 border-rose-500/50 text-rose-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-xs sm:text-sm font-bold">{notification.text}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs opacity-70 hover:opacity-100 font-bold underline cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Fixed Header */}
      <Header currentLang={currentLang} onLanguageChange={handleLanguageChange} />

      <main>
        {/* ── 1. Hero ── */}
        <Hero currentLang={currentLang} onOpenCheckout={handleOpenCheckout} />

        {/* ── 2. Benefits ── */}
        <section className="relative overflow-hidden">
          <div
            className="parallax-bg absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px]
                        bg-amber-900/8 rounded-full blur-3xl pointer-events-none"
          />
          <div className="reveal">
            <Benefits currentLang={currentLang} />
          </div>
        </section>

        {/* ── 3. Seminar Details ── */}
        <section className="relative overflow-hidden">
          <div
            className="parallax-slow absolute -left-24 top-1/3 w-72 h-72
                        bg-amber-500/5 rounded-full blur-3xl pointer-events-none"
          />
          <div
            className="parallax-slow absolute -right-24 bottom-1/4 w-72 h-72
                        bg-amber-500/5 rounded-full blur-3xl pointer-events-none"
          />
          <div className="reveal-left">
            <SeminarDetails currentLang={currentLang} onOpenCheckout={handleOpenCheckout} />
          </div>
        </section>

        {/* ── 4. Testimonials ── */}
        <section className="relative overflow-hidden">
          <div
            className="parallax-medium absolute top-0 right-0 w-96 h-96
                        bg-amber-900/6 rounded-full blur-3xl pointer-events-none"
          />
          <div className="reveal-scale">
            <Testimonials currentLang={currentLang} />
          </div>
        </section>

        {/* ── 5. Final CTA Banner ── */}
        <section className="relative py-16 sm:py-20 bg-black overflow-hidden">
          <div
            className="parallax-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[900px] h-[300px] bg-amber-800/10 rounded-full blur-3xl pointer-events-none"
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5 sm:space-y-6 relative z-10">
            <h2 className="text-white text-2xl sm:text-3xl lg:text-5xl font-black uppercase tracking-wide leading-tight reveal stagger-1">
              {t.cta.bannerTitlePart1}{' '}
              <span className="text-[#D4AF37]">{t.cta.bannerTitlePart2}</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed reveal stagger-2">
              {t.cta.bannerSubtitle}
            </p>
            <div className="flex justify-center reveal stagger-3">
              <button
                onClick={handleOpenCheckout}
                id="cta-final-banner"
                className="group inline-flex items-center justify-center space-x-3 btn-gold-primary
                           w-full sm:w-auto px-8 sm:px-10 py-4 rounded text-sm font-black
                           uppercase tracking-[0.12em] cursor-pointer"
              >
                <span>{t.cta.button}</span>
                <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <div className="reveal">
        <Footer currentLang={currentLang} />
      </div>

      {/* Enrollment Modal (course info + PayPal checkout) */}
      <EnrollmentModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        currentLang={currentLang}
        onPaymentCompleted={handlePaymentCompleted}
      />

      {/* Certificate Modal (post-payment: certificate name + Supabase save + WhatsApp redirect) */}
      <CertificateModal
        isOpen={isCertModalOpen}
        captureData={captureData}
        onClose={handleCloseCertModal}
      />
    </div>
  );
}