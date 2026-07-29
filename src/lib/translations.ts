export type Language = 'es' | 'en' | 'pt' | 'it' | 'fr' | 'de';

export interface TranslationSchema {
  nav: {
    home: string;
    instructor: string;
    benefits: string;
    seminar: string;
    certificate: string;
    faq: string;
    selectLanguage: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaButton: string;
    quickStats: {
      countries: string;
      zoomLive: string;
      certification: string;
    };
    instructorTag: string;
    instructorSub: string;
    academyLine1: string;
    academyLine2: string;
    headline1: string;
    headline2: string;
    subtitleText: string;
    securePayments: string;
    stats: [
      { line1: string; line2: string },
      { line1: string; line2: string },
      { line1: string; line2: string },
      { line1: string; line2: string }
    ];
  };
  instructor: {
    badge: string;
    title: string;
    subtitle: string;
    bio1: string;
    bio2: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
    signatureLabel: string;
  };
  benefits: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
    sectionHeading: string;
    shortTitles: [string, string, string, string, string, string];
  };
  seminar: {
    badge: string;
    title: string;
    subtitle: string;
    dateLabel: string;
    dateValue: string;
    modalityLabel: string;
    modalityValue: string;
    priceTag: string;
    originalPrice: string;
    currentPrice: string;
    ctaButton: string;
    modulesTitle: string;
    modules: Array<{
      number: string;
      title: string;
      desc: string;
    }>;
    liveBadge: string;
    courseTitleLine1: string;
    courseTitleLine2: string;
    checklist: string[];
  };
  certificate: {
    badge: string;
    title: string;
    subtitle: string;
    nameInputLabel: string;
    placeholderName: string;
    downloadPdf: string;
    officialBadge: string;
    verificationText: string;
    signatory: string;
    titleRole: string;
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      name: string;
      role: string;
      location: string;
      comment: string;
      rating: number;
    }>;
    sectionHeading: string;
    countries: [string, string, string];
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  checkout: {
    title: string;
    subtitle: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    selectCountry: string;
    paymentMethod: string;
    payWithStripe: string;
    payWithPaypal: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
    proceedToPayment: string;
    completePayment: string;
    processing: string;
    successTitle: string;
    successSubtitle: string;
    orderId: string;
    joinWhatsapp: string;
    whatsappBadge: string;
    zoomDetails: string;
    zoomDate: string;
    zoomLink: string;
    closeModal: string;
    modalBadge: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    disclaimer: string;
    quickLinks: string;
    followUs: string;
    securePlatform: string;
    paySafely: string;
    globalPlatform: string;
    navLinks: [string, string, string, string, string];
  };
  cta: {
    bannerTitlePart1: string;
    bannerTitlePart2: string;
    bannerSubtitle: string;
    button: string;
  };
};

export const translations: Record<Language, TranslationSchema> = {
  // ─────────────────────────── ESPAÑOL ───────────────────────────
  es: {
    nav: {
      home: 'Inicio',
      instructor: 'El Instructor',
      benefits: 'Beneficios',
      seminar: 'El Seminario',
      certificate: 'Certificado',
      faq: 'FAQ',
      selectLanguage: 'Lenguaje',
    },
    hero: {
      badge: 'Capacitación Presencial 2026',
      titleLine1: 'Seminario de Alta Barbería',
      titleLine2: 'Faded Mastery Elite',
      subtitle:
        'Capacitación Avanzada para Profesionales. Técnicas de fade y optimización de tiempos en función del sistema craneal.',
      ctaButton: 'INSCRÍBETE AHORA',
      quickStats: {
        countries: '+25 Países Participantes',
        zoomLive: 'Atención Presencial',
        certification: 'Firma Digital Exclusiva',
      },
      instructorTag: 'Antonio Ferreira',
      instructorSub: 'Master Educator & Barber Authority',
      academyLine1: 'ACADEMIA INTERNACIONAL',
      academyLine2: 'DE CORTE MASCULINO Y BARBERÍA PROFESIONAL',
      headline1: 'DOMINA EL ARTE',
      headline2: 'TRANSFORMA TU FUTURO',
      subtitleText: 'Capacitación Avanzada para Profesionales. Técnicas de fade y optimización de tiempos en función del sistema craneal.',
      securePayments: 'PAGOS 100% SEGUROS',
      stats: [
        { line1: 'CLASES PRESENCIALES', line2: 'EN VIVO' },
        { line1: 'CERTIFICADO DE', line2: 'PARTICIPACIÓN' },
        { line1: 'COFFEE BREAK', line2: 'INCLUIDO' },
        { line1: 'OPTIMIZACIÓN DE', line2: 'TIEMPOS' },
      ],
    },
    instructor: {
      badge: 'Autoridad Internacional',
      title: 'Conoce a Antonio Ferreira',
      subtitle:
        'Referente global en la evolución del estilismo masculino contemporáneo y la alta barbería.',
      bio1: 'Con más de 15 años de trayectoria liderando escenarios y plataformas educativas en Europa y América, Antonio Ferreira ha revolucionado el concepto del corte masculino de lujo combinando geometría clásica con dinamismo moderno.',
      bio2: 'Su metodología práctica y visionaria ha capacitado a miles de barberos profesionales que hoy dirigen los estudios más prestigiosos a nivel internacional.',
      stat1Label: 'Años de Trayectoria',
      stat1Value: '15+',
      stat2Label: 'Profesionales Certificados',
      stat2Value: '+10,000',
      stat3Label: 'Países Impactados',
      stat3Value: '35+',
      signatureLabel: 'Firma Oficial de Garantía Académica',
    },
    benefits: {
      badge: 'Por Qué Asistir',
      title: '6 Pilares de Transformación Profesional',
      subtitle:
        'Diseñado para barberos y estilistas que buscan distinguirse en un mercado altamente competitivo.',
      items: [
        {
          title: 'Técnicas Modernas de Corte',
          description:
            'Dominio de degradados pulidos, tijera avanzada, texturizado dinámico y visagismo personalizado para cada cliente.',
        },
        {
          title: 'Experiencia Real y Casos Prácticos',
          description:
            'Demostración paso a paso en modelos reales con corrección de ángulos y estructuras en tiempo real.',
        },
        {
          title: 'Crecimiento Profesional Acelerado',
          description:
            'Estrategias de posicionamiento, fijación de precios premium y fidelización de clientes de alto valor.',
        },
        {
          title: 'Acceso Internacional Exclusivo',
          description:
            'Participación en una red global de barberos élite para intercambio de oportunidades y conocimiento.',
        },
        {
          title: 'Certificación Digital Oficial',
          description:
            'Acredita tu capacitación con un certificado de validez internacional emitido con la firma original de Antonio Ferreira.',
        },
        {
          title: 'Soporte Personalizado Post-Seminario',
          description:
            'Acceso exclusivo a la comunidad privada para resolución de dudas, feedback y seguimiento continuo.',
        },
      ],
      sectionHeading: '¿POR QUÉ ESTUDIAR EN FERREIRA ACADEMY?',
      shortTitles: [
        'TÉCNICAS\nMODERNAS',
        'EXPERIENCIA\nREAL',
        'CRECE\nPROFESIONALMENTE',
        'DESDE CUALQUIER\nPARTE DEL MUNDO',
        'CERTIFICACIÓN\nDIGITAL',
        'SOPORTE\nPERSONALIZADO',
      ],
    },
    seminar: {
      badge: 'Detalles del Seminario',
      title: 'FADED MASTERY ELITE',
      subtitle:
        'Capacitación Avanzada para Profesionales. Técnicas de fade y optimización de tiempos en función del sistema craneal.',
      dateLabel: 'Fecha Oficial',
      dateValue: 'Domingo 9/08/2026',
      modalityLabel: 'Modalidad',
      modalityValue: 'Atención presencial',
      priceTag: 'Precio de Inscripción',
      originalPrice: '$95 USD',
      currentPrice: '$95 USD',
      ctaButton: 'INSCRÍBETE AHORA',
      modulesTitle: 'Programa del Seminario',
      modules: [
        {
          number: '01',
          title: 'Visagismo y Estructura Craneal',
          desc: 'Análisis morfopsicológico del rostro para diseñar cortes acordes a la anatomía de cada cliente.',
        },
        {
          number: '02',
          title: 'Fade Quirúrgico & Texturizado',
          desc: 'Técnicas de borrado de líneas, sombras pulidas y control absoluto de Tijeras vs. Máquina.',
        },
        {
          number: '03',
          title: 'Barboterapia & Styling Ejecutivo',
          desc: 'Ritual completo de perfilado de barba con toallas calientes y acabado con productos de alta gama.',
        },
        {
          number: '04',
          title: 'Marca Personal & Monetización',
          desc: 'Cómo cobrar tarifas de lujo, crear contenido de alto impacto y escalar tu barbería a nivel global.',
        },
      ],
      liveBadge: 'ATENCIÓN PRESENCIAL',
      courseTitleLine1: 'FADED MASTERY',
      courseTitleLine2: 'ELITE',
      checklist: [
        'Capacitación avanzada',
        'Técnicas de fade y optimización de tiempos en función del sistema craneal',
        'Certificado de Participación',
        'Coffee Break',
      ],
    },
    certificate: {
      badge: 'Validez Internacional',
      title: 'Certificado Digital Oficial',
      subtitle:
        'Respaldado por el sello distintivo y la firma oficial manuscrita de Antonio Ferreira.',
      nameInputLabel: 'Prueba tu nombre en el certificado:',
      placeholderName: 'Tu Nombre Completo',
      downloadPdf: 'Descargar Muestra Certificado PDF',
      officialBadge: 'Acreditación Verificada 2026',
      verificationText: 'Código de Autenticidad QR Único',
      signatory: 'Antonio Ferreira',
      titleRole: 'Fundador & Master Director, Ferreira Academy',
    },
    testimonials: {
      badge: 'Historias de Éxito',
      title: 'Lo Que Dicen Los Profesionales',
      subtitle:
        'Barberos de todo el mundo que han llevado sus negocios y habilidades al siguiente nivel.',
      items: [
        {
          name: 'Carlos Mendoza',
          role: 'Propietario & Master Barber',
          location: 'Madrid, España',
          comment:
            'Aprender con Antonio Ferreira cambió drásticamente la precisión de mis cortes. Mis clientes notaron la diferencia de inmediato y pude duplicar mis tarifas.',
          rating: 5,
        },
        {
          name: 'Alex Rivera',
          role: 'Director de Barber Studio',
          location: 'Miami, EE. UU.',
          comment:
            'La metodología de Antonio es pura práctica sin rodeos. La comunidad de WhatsApp post-evento sigue aportando un valor incalculable.',
          rating: 5,
        },
        {
          name: 'Jean-Luc Moreau',
          role: 'Estilista Masculino Senior',
          location: 'París, Francia',
          comment:
            'Un seminario internacional de verdadero lujo. El certificado firmado por Antonio es un sello de prestigio que exhibo con orgullo en mi salón.',
          rating: 5,
        },
      ],
      sectionHeading: 'LO QUE DICEN NUESTROS ESTUDIANTES',
      countries: ['México', 'Colombia', 'Chile'],
    },
    faq: {
      badge: 'Resolución de Dudas',
      title: 'Preguntas Frecuentes',
      subtitle: 'Todo lo que necesitas saber antes de asegurar tu cupo presencial.',
      items: [
        {
          question: '¿Cómo accedo al lugar de la capacitación?',
          answer:
            'Inmediatamente después de completar tu pago en la plataforma, recibirás una confirmación con la dirección exacta del evento presencial y la invitación exclusiva al grupo de WhatsApp.',
        },
        {
          question: '¿Cuándo y cómo recibo mi certificado oficial?',
          answer:
            'Al finalizar el seminario presencial, recibirás automáticamente en tu correo electrónico el Certificado Digital en formato PDF de alta resolución con tu nombre completo y la firma oficial de Antonio Ferreira.',
        },
        {
          question: '¿Qué métodos de pago están disponibles?',
          answer:
            'Aceptamos pagos internacionales seguros procesados en dólares americanos (USD) mediante Stripe (Tarjetas de Crédito y Débito Visa, Mastercard, AMEX) y PayPal.',
        },
        {
          question: '¿Qué pasa si no puedo asistir en la fecha programada?',
          answer:
            'Te solicitamos comunicarte con soporte al menos 48 horas antes del evento para coordinar la reprogramación de tu cupo para la siguiente fecha disponible.',
        },
        {
          question: '¿Cómo me uniré a la Comunidad Privada de WhatsApp?',
          answer:
            'El enlace único de invitación al grupo privado se desbloquea única y exclusivamente tras confirmar el pago exitoso en el sistema.',
        },
      ],
    },
    checkout: {
      title: 'Registro Oficial - Faded Mastery Elite',
      subtitle: 'Asegura tu cupo en la Capacitación Avanzada para Profesionales de Antonio Ferreira',
      step1Title: '1. Datos del Asistente',
      step2Title: '2. Selección de Pago (USD)',
      step3Title: '3. Confirmación & Accesos',
      fullName: 'Nombre Completo (para Certificado)',
      email: 'Correo Electrónico',
      phone: 'Teléfono / WhatsApp (con código de país)',
      country: 'País de Residencia',
      selectCountry: 'Selecciona tu país...',
      paymentMethod: 'Método de Pago',
      payWithStripe: 'Tarjeta de Crédito / Débito (Stripe)',
      payWithPaypal: 'PayPal Express Checkout',
      cardNumber: 'Número de Tarjeta',
      cardExpiry: 'Expiración (MM/AA)',
      cardCvc: 'Código CVC',
      proceedToPayment: 'Continuar al Pago ($80 USD)',
      completePayment: 'Completar Pago Seguro ($80 USD)',
      processing: 'Procesando Inscripción Segura...',
      successTitle: '¡Inscripción Confirmada con Éxito!',
      successSubtitle: 'Bienvenido a Ferreira Academy. Tu cupo oficial ha sido reservado.',
      orderId: 'ID de Transacción',
      joinWhatsapp: 'UNIRSE A LA COMUNIDAD EXCLUSIVA DE WHATSAPP',
      whatsappBadge: 'Acceso Permitido Exclusivamente Post-Pago',
      zoomDetails: 'Detalles del Curso Presencial',
      zoomDate: 'Domingo 9/08/2026',
      zoomLink: 'Dirección / Sede Presencial',
      closeModal: 'Cerrar Portal',
      modalBadge: 'Faded Mastery Elite - Presencial 2026',
    },
    footer: {
      rights: '© 2026 Ferreira Academy. Todos los derechos reservados.',
      privacy: 'Política de Privacidad',
      terms: 'Términos y Condiciones',
      disclaimer:
        'Ferreira Academy es una marca registrada de educación internacional en alta barbería.',
      quickLinks: 'ENLACES RÁPIDOS',
      followUs: 'SÍGUENOS',
      securePlatform: 'PLATAFORMA SEGURA',
      paySafely: 'Paga de forma segura con:',
      globalPlatform: 'PLATAFORMA GLOBAL DE FORMACIÓN PROFESIONAL.',
      navLinks: ['Inicio', 'Beneficios', 'El Curso', 'Testimonios', 'Contacto'],
    },
    cta: {
      bannerTitlePart1: 'TU PRÓXIMO NIVEL',
      bannerTitlePart2: 'COMIENZA AQUÍ',
      bannerSubtitle:
        'Únete a cientos de estudiantes que ya están transformando su talento en una carrera profesional.',
      button: 'INSCRÍBETE AHORA',
    },
  },

  // ─────────────────────────── ENGLISH ───────────────────────────
  en: {
    nav: {
      home: 'Home',
      instructor: 'The Instructor',
      benefits: 'Benefits',
      seminar: 'The Seminar',
      certificate: 'Certificate',
      faq: 'FAQ',
      selectLanguage: 'Language',
    },
    hero: {
      badge: 'In-person Training 2026',
      titleLine1: 'High-End Barbering Seminar',
      titleLine2: 'Faded Mastery Elite',
      subtitle:
        'Advanced Training for Professionals. Fade techniques and time optimization based on the cranial system.',
      ctaButton: 'ENROLL NOW',
      quickStats: {
        countries: '+25 Countries Participating',
        zoomLive: 'In-person Attendance',
        certification: 'Exclusive Digital Signature',
      },
      instructorTag: 'Antonio Ferreira',
      instructorSub: 'Master Educator & Barber Authority',
      academyLine1: 'INTERNATIONAL ACADEMY',
      academyLine2: 'OF MALE CUTTING & PROFESSIONAL BARBERING',
      headline1: 'DOMINATE THE ART',
      headline2: 'TRANSFORM YOUR FUTURE',
      subtitleText: 'Advanced Training for Professionals. Fade techniques and time optimization based on the cranial system.',
      securePayments: '100% SECURE PAYMENTS',
      stats: [
        { line1: 'IN-PERSON CLASSES', line2: 'LIVE' },
        { line1: 'CERTIFICATE OF', line2: 'PARTICIPATION' },
        { line1: 'COFFEE BREAK', line2: 'INCLUDED' },
        { line1: 'TIME', line2: 'OPTIMIZATION' },
      ],
    },
    instructor: {
      badge: 'International Authority',
      title: 'Meet Antonio Ferreira',
      subtitle:
        'Global benchmark in the evolution of contemporary male styling and high-end barbering.',
      bio1: 'With over 15 years leading stages and educational platforms in Europe and America, Antonio Ferreira has revolutionized luxury male cutting by blending classic geometry with modern dynamism.',
      bio2: 'His practical, visionary methodology has trained thousands of professional barbers who now run the most prestigious studios worldwide.',
      stat1Label: 'Years of Experience',
      stat1Value: '15+',
      stat2Label: 'Certified Professionals',
      stat2Value: '+10,000',
      stat3Label: 'Countries Reached',
      stat3Value: '35+',
      signatureLabel: 'Official Academic Guarantee Signature',
    },
    benefits: {
      badge: 'Why Attend',
      title: '6 Pillars of Professional Transformation',
      subtitle:
        'Designed for barbers and stylists who seek to stand out in a highly competitive global market.',
      items: [
        {
          title: 'Modern Cutting Techniques',
          description:
            'Master clean fades, advanced shears work, dynamic texturizing, and custom visagism for every client.',
        },
        {
          title: 'Real Experience & Case Studies',
          description:
            'Step-by-step live demonstration on real models with real-time angle and structure adjustments.',
        },
        {
          title: 'Accelerated Career Growth',
          description:
            'Personal branding strategies, premium pricing models, and high-ticket client retention.',
        },
        {
          title: 'Exclusive International Network',
          description:
            'Join an elite global network of barbers for international opportunities and knowledge exchange.',
        },
        {
          title: 'Official Digital Certification',
          description:
            'Validate your expertise with an internationally recognized certificate featuring Antonio Ferreira\'s original signature.',
        },
        {
          title: 'Personalized Post-Seminar Support',
          description:
            'Exclusive access to the private community for Q&A, detailed feedback, and ongoing mentorship.',
        },
      ],
      sectionHeading: 'WHY STUDY AT FERREIRA ACADEMY?',
      shortTitles: [
        'MODERN\nTECHNIQUES',
        'REAL\nEXPERIENCE',
        'GROW\nPROFESSIONALLY',
        'FROM ANYWHERE\nIN THE WORLD',
        'DIGITAL\nCERTIFICATION',
        'PERSONALIZED\nSUPPORT',
      ],
    },
    seminar: {
      badge: 'Seminar Details',
      title: 'FADED MASTERY ELITE',
      subtitle:
        'Advanced Training for Professionals. Fade techniques and time optimization based on the cranial system.',
      dateLabel: 'Official Date',
      dateValue: 'Sunday 9/08/2026',
      modalityLabel: 'Modality',
      modalityValue: 'In-person attendance',
      priceTag: 'Enrollment Price',
      originalPrice: '$95 USD',
      currentPrice: '$95 USD',
      ctaButton: 'ENROLL NOW',
      modulesTitle: 'Seminar Curriculum',
      modules: [
        {
          number: '01',
          title: 'Visagism & Cranial Structure',
          desc: 'Morphopsychological facial analysis to design hair cuts tailored to individual head anatomy.',
        },
        {
          number: '02',
          title: 'Surgical Fade & Texturizing',
          desc: 'Seamless line-fading techniques, polished shadows, and absolute control of Clippers vs. Shears.',
        },
        {
          number: '03',
          title: 'Beard Therapy & Executive Styling',
          desc: 'Complete hot-towel beard shaping ritual and high-end grooming finish.',
        },
        {
          number: '04',
          title: 'Personal Branding & Monetization',
          desc: 'How to charge luxury rates, produce high-impact content, and scale your brand globally.',
        },
      ],
      liveBadge: 'IN-PERSON TRAINING',
      courseTitleLine1: 'FADED MASTERY',
      courseTitleLine2: 'ELITE',
      checklist: [
        'Advanced training',
        'Fade techniques and time optimization based on the cranial system',
        'Certificate of Participation',
        'Coffee Break',
      ],
    },
    certificate: {
      badge: 'International Accreditation',
      title: 'Official Digital Certificate',
      subtitle: 'Backed by the official seal and handwritten signature of Antonio Ferreira.',
      nameInputLabel: 'Preview your name on the certificate:',
      placeholderName: 'Your Full Name',
      downloadPdf: 'Download Sample PDF Certificate',
      officialBadge: 'Verified Accreditation 2026',
      verificationText: 'Unique QR Authenticity Code',
      signatory: 'Antonio Ferreira',
      titleRole: 'Founder & Master Director, Ferreira Academy',
    },
    testimonials: {
      badge: 'Success Stories',
      title: 'What Professionals Say',
      subtitle: 'Barbers around the world who elevated their businesses and craft with Antonio Ferreira.',
      items: [
        {
          name: 'Carlos Mendoza',
          role: 'Owner & Master Barber',
          location: 'Madrid, Spain',
          comment:
            'Learning under Antonio Ferreira drastically upgraded my precision. My clients noticed the difference immediately and I doubled my rates.',
          rating: 5,
        },
        {
          name: 'Alex Rivera',
          role: 'Barber Studio Director',
          location: 'Miami, USA',
          comment:
            'Antonio\'s methodology is straight to the point. The post-event WhatsApp community continues to provide immense value.',
          rating: 5,
        },
        {
          name: 'Jean-Luc Moreau',
          role: 'Senior Male Stylist',
          location: 'Paris, France',
          comment:
            'A truly luxurious international seminar. The certificate signed by Antonio is a seal of prestige that I proudly display in my salon.',
          rating: 5,
        },
      ],
      sectionHeading: 'WHAT OUR STUDENTS SAY',
      countries: ['Mexico', 'Colombia', 'Chile'],
    },
    faq: {
      badge: 'Q&A Help',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know before securing your in-person seat.',
      items: [
        {
          question: 'How do I access the venue?',
          answer:
            'Immediately after completing payment, you will receive a confirmation with the exact address of the in-person event and the exclusive invite to the WhatsApp group.',
        },
        {
          question: 'When and how do I receive my official certificate?',
          answer:
            'Right after the in-person seminar finishes, your high-resolution digital PDF certificate featuring your full name and Antonio Ferreira\'s signature will be delivered to your email.',
        },
        {
          question: 'What payment methods are supported?',
          answer:
            'We accept secure international payments in US Dollars (USD) via Stripe (Visa, Mastercard, AMEX Credit & Debit cards) and PayPal.',
        },
        {
          question: 'What if I cannot attend the event on the scheduled date?',
          answer:
            'Please contact support at least 48 hours before the event to coordinate rescheduling your seat for the next available date.',
        },
        {
          question: 'How do I join the Private WhatsApp Community?',
          answer:
            'The unique invitation link to the private group is unlocked exclusively after successful payment confirmation.',
        },
      ],
    },
    checkout: {
      title: 'Official Registration - Faded Mastery Elite',
      subtitle: 'Secure your seat for Antonio Ferreira\'s Advanced Training for Professionals',
      step1Title: '1. Attendee Information',
      step2Title: '2. Payment Selection (USD)',
      step3Title: '3. Confirmation & Access',
      fullName: 'Full Name (for Certificate)',
      email: 'Email Address',
      phone: 'Phone / WhatsApp (with country code)',
      country: 'Country of Residence',
      selectCountry: 'Select your country...',
      paymentMethod: 'Payment Method',
      payWithStripe: 'Credit / Debit Card (Stripe)',
      payWithPaypal: 'PayPal Express Checkout',
      cardNumber: 'Card Number',
      cardExpiry: 'Expiration (MM/YY)',
      cardCvc: 'CVC Code',
      proceedToPayment: 'Proceed to Payment ($80 USD)',
      completePayment: 'Complete Secure Payment ($80 USD)',
      processing: 'Processing Secure Enrollment...',
      successTitle: 'Enrollment Successfully Confirmed!',
      successSubtitle: 'Welcome to Ferreira Academy. Your seat has been reserved.',
      orderId: 'Transaction ID',
      joinWhatsapp: 'JOIN EXCLUSIVE WHATSAPP COMMUNITY',
      whatsappBadge: 'Access Granted Exclusively Post-Payment',
      zoomDetails: 'In-person Course Details',
      zoomDate: 'Sunday 9/08/2026',
      zoomLink: 'Location / In-person Venue',
      closeModal: 'Close Portal',
      modalBadge: 'Faded Mastery Elite - In-person 2026',
    },
    footer: {
      rights: '© 2026 Ferreira Academy. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      disclaimer:
        'Ferreira Academy is a registered trademark of international education in luxury barbering.',
      quickLinks: 'QUICK LINKS',
      followUs: 'FOLLOW US',
      securePlatform: 'SECURE PLATFORM',
      paySafely: 'Pay securely with:',
      globalPlatform: 'GLOBAL PROFESSIONAL TRAINING PLATFORM.',
      navLinks: ['Home', 'Benefits', 'The Course', 'Testimonials', 'Contact'],
    },
    cta: {
      bannerTitlePart1: 'YOUR NEXT LEVEL',
      bannerTitlePart2: 'STARTS HERE',
      bannerSubtitle:
        'Join hundreds of students who are already transforming their talent into a professional career.',
      button: 'ENROLL NOW',
    },
  },

     // ─────────────────────────── PORTUGUEZ ───────────────────────────
    pt: {
    nav: {
      home: 'Início',
      instructor: 'O Instrutor',
      benefits: 'Vantagens',
      seminar: 'O Seminário',
      certificate: 'Certificado',
      faq: 'FAQ',
      selectLanguage: 'Idioma',
    },
    hero: {
      badge: 'Capacitação Presencial 2026',
      titleLine1: 'Seminário de Alta Barbearia',
      titleLine2: 'Faded Mastery Elite',
      subtitle:
        'Capacitação Avançada para Profissionais. Técnicas de fade e otimização de tempos com base no sistema cranial.',
      ctaButton: 'INSCREVA-SE AGORA',
      quickStats: {
        countries: '+25 Países Participantes',
        zoomLive: 'Atendimento Presencial',
        certification: 'Assinatura Digital Exclusiva',
      },
      instructorTag: 'Antonio Ferreira',
      instructorSub: 'Master Educator & Barber Authority',
      academyLine1: 'ACADEMIA INTERNACIONAL',
      academyLine2: 'DE CORTE MASCULINO E BARBEARIA PROFISSIONAL',
      headline1: 'DOMINE A ARTE',
      headline2: 'TRANSFORME SEU FUTURO',
      subtitleText: 'Capacitação Avançada para Profissionais. Técnicas de fade e otimização de tempos com base no sistema cranial.',
      securePayments: 'PAGAMENTOS 100% SEGUROS',
      stats: [
        { line1: 'CLASES PRESENCIAIS', line2: 'AO VIVO' },
        { line1: 'CERTIFICADO DE', line2: 'PARTICIPAÇÃO' },
        { line1: 'COFFEE BREAK', line2: 'INCLUÍDO' },
        { line1: 'OTIMIZAÇÃO DE', line2: 'TEMPOS' },
      ],
    },
    instructor: {
      badge: 'Autoridade Internacional',
      title: 'Conheça Antonio Ferreira',
      subtitle:
        'Referência global na evolução do estilismo masculino contemporâneo e alta barbearia.',
      bio1: 'Com mais de 15 anos de trajetória liderando palcos e plataformas educacionais na Europa e América, Antonio Ferreira revolucionou o corte masculino de luxo unindo geometria clássica e dinamismo moderno.',
      bio2: 'Sua metodologia prática e visionaria já capacitou milhares de barbeiros profissionais que hoje dirigem estúdios de alto prestígio mundialmente.',
      stat1Label: 'Anos de Experiência',
      stat1Value: '15+',
      stat2Label: 'Profissionais Certificados',
      stat2Value: '+10.000',
      stat3Label: 'Países Alcançados',
      stat3Value: '35+',
      signatureLabel: 'Assinatura Oficial de Garantia Acadêmica',
    },
    benefits: {
      badge: 'Por Que Participar',
      title: '6 Pilares de Transformação Profissional',
      subtitle:
        'Desenhado para barbeiros e estilistas que buscam destaque em um mercado global altamente competitivo.',
      items: [
        {
          title: 'Técnicas Modernas de Corte',
          description:
            'Domínio de fades limpos, tesoura avançada, texturização dinâmica e visagismo personalizado para cada cliente.',
        },
        {
          title: 'Experiência Real e Casos Práticos',
          description:
            'Demonstração passo a passo em modelos reais com correção de ângulos e estruturas em tempo real.',
        },
        {
          title: 'Crecimento Profissional Acelerado',
          description:
            'Estratégias de posicionamento de marca, precificação premium e fidelização de clientes de alto ticket.',
        },
        {
          title: 'Acesso Internacional Exclusivo',
          description:
            'Conexão com uma rede global de barbeiros de elite para troca de oportunidades e conhecimento.',
        },
        {
          title: 'Certificação Digital Oficial',
          description:
            'Acredite sua capacitação com certificado de validade internacional emitido com a assinatura original de Antonio Ferreira.',
        },
        {
          title: 'Suporte Personalizado Pós-Seminário',
          description:
            'Acesso exclusivo à comunidade privada para resolução de dúvidas, feedback detalhado e mentoria.',
        },
      ],
      sectionHeading: 'POR QUE ESTUDAR NA FERREIRA ACADEMY?',
      shortTitles: [
        'TÉCNICAS\nMODERNAS',
        'EXPERIÊNCIA\nREAL',
        'CRESÇA\nPROFISSIONALMENTE',
        'DE QUALQUER\nPARTE DO MUNDO',
        'CERTIFICAÇÃO\nDIGITAL',
        'SUPORTE\nPERSONALIZADO',
      ],
    },
    seminar: {
      badge: 'Detalhes do Seminário',
      title: 'FADED MASTERY ELITE',
      subtitle:
        'Capacitação Avançada para Profissionais. Técnicas de fade e otimização de tempos com base no sistema cranial.',
      dateLabel: 'Data Oficial',
      dateValue: 'Domingo 9/08/2026',
      modalityLabel: 'Modalidade',
      modalityValue: 'Atendimento presencial',
      priceTag: 'Preço de Inscrição',
      originalPrice: '$80 USD',
      currentPrice: '$80 USD',
      ctaButton: 'INSCREVA-SE AGORA',
      modulesTitle: 'Programa do Seminário',
      modules: [
        {
          number: '01',
          title: 'Visagismo e Estrutura Craniana',
          desc: 'Análise morfopsicológica facial para criar cortes sob medida para a anatomia de cada cliente.',
        },
        {
          number: '02',
          title: 'Fade Cirúrgico & Texturização',
          desc: 'Técnicas de apagamento de linhas, sombreamento perfeito e controle absoluto de Tesoura vs. Máquina.',
        },
        {
          number: '03',
          title: 'Barboterapia & Styling Executivo',
          desc: 'Ritual completo de modelagem de barba com toalhas quentes e acabamento com produtos de alta gama.',
        },
        {
          number: '04',
          title: 'Marca Pessoal & Monetização',
          desc: 'Como cobrar tarifas de luxo, gerar conteúdo de alto impacto e escalar sua barbearia mundialmente.',
        },
      ],
      liveBadge: 'ATENDIMENTO PRESENCIAL',
      courseTitleLine1: 'FADED MASTERY',
      courseTitleLine2: 'ELITE',
      checklist: [
        'Capacitação avançada',
        'Técnicas de fade e otimização de tempos com base no sistema cranial',
        'Certificado de Participação',
        'Coffee Break',
      ],
    },
    certificate: {
      badge: 'Validade Internacional',
      title: 'Certificado Digital Oficial',
      subtitle:
        'Com o selo de autenticidade e a assinatura manuscrita oficial de Antonio Ferreira.',
      nameInputLabel: 'Teste seu nome no certificado:',
      placeholderName: 'Seu Nome Completo',
      downloadPdf: 'Baixar Amostra Certificado PDF',
      officialBadge: 'Acreditação Verificada 2026',
      verificationText: 'Código Único de Autenticidade QR',
      signatory: 'Antonio Ferreira',
      titleRole: 'Fundador & Master Director, Ferreira Academy',
    },
    testimonials: {
      badge: 'Histórias de Sucesso',
      title: 'O Que Dizem Os Profissionais',
      subtitle:
        'Barbeiros de todo o mundo que elevaram seus negócios e habilidades com Antonio Ferreira.',
      items: [
        {
          name: 'Carlos Mendoza',
          role: 'Proprietário & Master Barber',
          location: 'Madri, Espanha',
          comment:
            'Aprender com Antonio Ferreira mudou drasticamente a precisão dos meus cortes. Meus clientes notaram a diferença imediatamente e dobrei meus preços.',
          rating: 5,
        },
        {
          name: 'Alex Rivera',
          role: 'Diretor de Barber Studio',
          location: 'Miami, EUA',
          comment:
            'A metodologia de Antonio é prática direta sem rodeios. A comunidade de WhatsApp pós-evento continua entregando um valor inestimável.',
          rating: 5,
        },
        {
          name: 'Jean-Luc Moreau',
          role: 'Estilista Masculino Senior',
          location: 'Paris, França',
          comment:
            'Um seminário internacional de verdadeiro luxo. O certificado assinado por Antonio é um selo de prestígio que exibo com orgulho em meu salão.',
          rating: 5,
        },
      ],
      sectionHeading: 'O QUE DIZEM NOSSOS ESTUDANTES',
      countries: ['México', 'Colômbia', 'Chile'],
    },
    faq: {
      badge: 'Resolução de Dúvidas',
      title: 'Perguntas Frecuentes',
      subtitle: 'Tudo o que você precisa saber antes de garantir sua vaga presencial.',
      items: [
        {
          question: 'Como chego ao local do evento?',
          answer:
            'Imediatamente após concluir o pagamento, você receberá a confirmação com o endereço exato do evento presencial e o convite exclusivo para o grupo de WhatsApp.',
        },
        {
          question: 'Quando e como recebo meu certificado oficial?',
          answer:
            'Assim que o seminário presencial for concluído, você receberá automaticamente em seu e-mail o Certificado Digital PDF em alta resolução com seu nome completo e assinatura oficial de Antonio Ferreira.',
        },
        {
          question: 'Quais são os métodos de pagamento aceitos?',
          answer:
            'Aceitamos pagamentos internacionais seguros em Dólares Americanos (USD) via Stripe (Cartões de Crédito e Débito Visa, Mastercard, AMEX) e PayPal.',
        },
        {
          question: 'E se eu não puder assistir na data agendada?',
          answer:
            'Por favor entre em contato com o suporte com pelo menos 48 horas de antecedência para remarcar seu cupom para a próxima data disponível.',
        },
        {
          question: 'Como entro na Comunidade Privada de WhatsApp?',
          answer:
            'O link de convite exclusivo ao grupo privado é liberado única e exclusivamente após a confirmação do pagamento no sistema.',
        },
      ],
    },
    checkout: {
      title: 'Inscrição Oficial - Faded Mastery Elite',
      subtitle: 'Garanta sua vaga na Capacitação Avançada para Profissionais',
      step1Title: '1. Dados do Participante',
      step2Title: '2. Seleção de Pagamento (USD)',
      step3Title: '3. Confirmação & Acessos',
      fullName: 'Nome Completo (para Certificado)',
      email: 'E-mail',
      phone: 'Telefone / WhatsApp (com código do país)',
      country: 'País de Residência',
      selectCountry: 'Selecione seu país...',
      paymentMethod: 'Método de Pagamento',
      payWithStripe: 'Cartão de Crédito / Débito (Stripe)',
      payWithPaypal: 'PayPal Express Checkout',
      cardNumber: 'Número do Cartão',
      cardExpiry: 'Validade (MM/AA)',
      cardCvc: 'Código CVC',
      proceedToPayment: 'Continuar para Pagamento ($80 USD)',
      completePayment: 'Concluir Pagamento Seguro ($80 USD)',
      processing: 'Processando Inscrição Segura...',
      successTitle: 'Inscrição Confimada com Sucesso!',
      successSubtitle: 'Bem-vindo à Ferreira Academy. Sua vaga oficial está garantida.',
      orderId: 'ID de Transação',
      joinWhatsapp: 'ENTRAR NA COMUNIDADE EXCLUSIVA DO WHATSAPP',
      whatsappBadge: 'Acesso Permitido Exclusivamente Pós-Pagamento',
      zoomDetails: 'Detalhes do Atendimento Presencial',
      zoomDate: 'Domingo, 9/08/2026',
      zoomLink: 'Localização / Sede Presencial',
      closeModal: 'Fechar Portal',
      modalBadge: 'Faded Mastery Elite - Presencial 2026',
    },
    footer: {
      rights: '© 2026 Ferreira Academy. Todos os direitos reservados.',
      privacy: 'Política de Privacidade',
      terms: 'Termos e Condições',
      disclaimer:
        'Ferreira Academy é uma marca registrada de educação internacional em alta barbearia.',
      quickLinks: 'LINKS RÁPIDOS',
      followUs: 'SIGA-NOS',
      securePlatform: 'PLATAFORMA SEGURA',
      paySafely: 'Pague de forma segura com:',
      globalPlatform: 'PLATAFORMA GLOBAL DE FORMAÇÃO PROFISSIONAL.',
      navLinks: ['Início', 'Benefícios', 'O Curso', 'Depoimentos', 'Contato'],
    },
    cta: {
      bannerTitlePart1: 'SEU PRÓXIMO NÍVEL',
      bannerTitlePart2: 'COMEÇA AQUI',
      bannerSubtitle:
        'Junte-se a centenas de estudantes que já estão transformando seu talento em uma carreira profissional.',
      button: 'INSCREVA-SE AGORA',
    },
  },

  // ─────────────────────────── ITALIANO ───────────────────────────
  it: {
    nav: {
      home: 'Home',
      instructor: "L'Istruttore",
      benefits: 'Benefici',
      seminar: 'Il Seminario',
      certificate: 'Certificato',
      faq: 'Domande Frequenti',
      selectLanguage: 'Lingua',
    },
    hero: {
      badge: 'Masterclass Internazionale 2026',
      titleLine1: 'Seminario Internazionale di Alta Barberia',
      titleLine2: 'e Taglio Maschile di Élite',
      subtitle:
        'Apprendi le tecniche all\'avanguardia di taglio, visagismo e barberia esecutiva dal vivo con Antonio Ferreira. Domina il settore ed eleva la tua carriera a livello internazionale.',
      ctaButton: 'ISCRIVITI ORA',
      quickStats: {
        countries: '+25 Paesi Partecipanti',
        zoomLive: 'Streaming HD dal Vivo',
        certification: 'Firma Digitale Esclusiva',
      },
      instructorTag: 'Antonio Ferreira',
      instructorSub: 'Master Educator & Barber Authority',
      academyLine1: 'ACCADEMIA INTERNAZIONALE',
      academyLine2: 'DI TAGLIO MASCHILE E BARBERIA PROFESSIONALE',
      headline1: 'DOMINA L\'ARTE',
      headline2: 'TRASFORMA IL TUO FUTURO',
      subtitleText: 'Impara le tecniche moderne di taglio maschile e barberia professionale con Antonio Ferreira, da qualsiasi parte del mondo.',
      securePayments: 'PAGAMENTI 100% SICURI',
      stats: [
        { line1: 'LEZIONI DAL VIVO', line2: 'VIA ZOOM' },
        { line1: 'ACCESSO PERMANENTE', line2: 'ALLE REGISTRAZIONI' },
        { line1: 'CERTIFICAZIONE', line2: 'DIGITALE' },
        { line1: 'COMUNITÀ', line2: 'INTERNAZIONALE' },
      ],
    },
    instructor: {
      badge: 'Autorità Internazionale',
      title: 'Scopri Antonio Ferreira',
      subtitle:
        'Punto di riferimento globale nell\'evoluzione dello styling maschile contemporaneo e dell\'alta barberia.',
      bio1: 'Con oltre 15 anni di esperienza alla guida di palcoscenici e piattaforme educative in Europa e America, Antonio Ferreira ha rivoluzionato il taglio maschile di lusso, unendo geometria classica e dinamismo moderno.',
      bio2: 'La sua metodologia pratica e visionaria ha formato migliaia di barbieri professionisti che oggi gestiscono i saloni più prestigiosi a livello internazionale.',
      stat1Label: 'Anni di Esperienza',
      stat1Value: '15+',
      stat2Label: 'Professionisti Certificati',
      stat2Value: '+10.000',
      stat3Label: 'Paesi Raggiunti',
      stat3Value: '35+',
      signatureLabel: 'Firma Ufficiale di Garanzia Accademica',
    },
    benefits: {
      badge: 'Perché Partecipare',
      title: '6 Pilastri di Trasformazione Professionale',
      subtitle:
        'Progettato per barbieri e stilisti che desiderano distinguersi in un mercato globale altamente competitivo.',
      items: [
        {
          title: 'Tecniche Moderne di Taglio',
          description:
            'Padronanza di sfumature precise, cesoie avanzate, texturizzazione dinamica e visagismo personalizzato per ogni cliente.',
        },
        {
          title: 'Esperienza Reale e Casi Pratici',
          description:
            'Dimostrazione passo dopo passo su modelli reali con correzione di angoli e strutture in tempo reale.',
        },
        {
          title: 'Crescita Professionale Accelerata',
          description:
            'Strategie di personal branding, modelli di prezzo premium e fidelizzazione di clienti di alto valore.',
        },
        {
          title: 'Accesso Internazionale Esclusivo',
          description:
            'Entra a far parte di una rete globale di élite di barbieri per opportunità internazionali e scambi di conoscenze.',
        },
        {
          title: 'Certificazione Digitale Ufficiale',
          description:
            'Valida la tua formazione con un certificato a riconoscimento internazionale con la firma originale di Antonio Ferreira.',
        },
        {
          title: 'Supporto Personalizzato Post-Seminario',
          description:
            'Accesso esclusivo alla community privata per domande, feedback dettagliato e tutoraggio continuo.',
        },
      ],
      sectionHeading: 'PERCHÉ STUDIARE ALLA FERREIRA ACADEMY?',
      shortTitles: [
        'TECNICHE\nMODERNE',
        'ESPERIENZA\nREALE',
        'CRESCI\nPROFESSIONALMENTE',
        'DA QUALSIASI\nPARTE DEL MONDO',
        'CERTIFICAZIONE\nDIGITALE',
        'SUPPORTO\nPERSONALIZZATO',
      ],
    },
    seminar: {
      badge: 'Dettagli del Seminario',
      title: 'Masterclass Internazionale: High-End Barbering 2026',
      subtitle:
        'Una giornata intensiva di totale immersione nelle tecniche esecutive e nella visione imprenditoriale dell\'alta barberia.',
      dateLabel: 'Data Ufficiale',
      dateValue: '15 Ottobre 2026',
      modalityLabel: 'Modalità',
      modalityValue: 'Dal Vivo via Zoom HD',
      priceTag: 'Offerta di Lancio Internazionale',
      originalPrice: '$350 USD',
      currentPrice: '$149 USD',
      ctaButton: 'ISCRIVITI ORA',
      modulesTitle: 'Programma del Seminario',
      modules: [
        {
          number: '01',
          title: 'Visagismo e Struttura Cranica',
          desc: 'Analisi morfopsicologica del viso per progettare tagli in linea con l\'anatomia di ogni cliente.',
        },
        {
          number: '02',
          title: 'Fade Chirurgico & Texturizzazione',
          desc: 'Tecniche di dissolvenza delle linee, ombre levigate e controllo assoluto di Forbici vs. Macchinetta.',
        },
        {
          number: '03',
          title: 'Barbaterapia & Styling Esecutivo',
          desc: 'Rituale completo di profilatura della barba con asciugamani caldi e finitura con prodotti di alta gamma.',
        },
        {
          number: '04',
          title: 'Personal Branding & Monetizzazione',
          desc: 'Come applicare tariffe di lusso, creare contenuti ad alto impatto e scalare il tuo brand a livello globale.',
        },
      ],
      liveBadge: 'CORSO DAL VIVO',
      courseTitleLine1: 'TAGLIO MASCHILE',
      courseTitleLine2: 'E BARBERIA PROFESSIONALE',
      checklist: [
        'Fondamenti e tecniche avanzate di taglio maschile',
        'Sfumature, texture e finiture professionali',
        'Cura della barba e profilatura',
        'Styling e tendenze attuali',
        'Sessioni dal vivo + accesso illimitato alle registrazioni',
        'Certificato digitale al completamento',
      ],
    },
    certificate: {
      badge: 'Validità Internazionale',
      title: 'Certificato Digitale Ufficiale',
      subtitle:
        'Supportato dal sigillo distintivo e dalla firma manoscritta ufficiale di Antonio Ferreira.',
      nameInputLabel: 'Visualizza il tuo nome sul certificato:',
      placeholderName: 'Il Tuo Nome Completo',
      downloadPdf: 'Scarica il Campione Certificato PDF',
      officialBadge: 'Accreditamento Verificato 2026',
      verificationText: 'Codice QR di Autenticità Unico',
      signatory: 'Antonio Ferreira',
      titleRole: 'Fondatore & Master Director, Ferreira Academy',
    },
    testimonials: {
      badge: 'Storie di Successo',
      title: 'Cosa Dicono i Professionisti',
      subtitle:
        'Barbieri da tutto il mondo che hanno portato le loro attività e competenze al livello successivo.',
      items: [
        {
          name: 'Carlos Mendoza',
          role: 'Proprietario & Master Barber',
          location: 'Madrid, Spagna',
          comment:
            'Imparare con Antonio Ferreira ha migliorato drasticamente la precisione dei miei tagli. I miei clienti hanno notato subito la differenza e ho potuto raddoppiare le mie tariffe.',
          rating: 5,
        },
        {
          name: 'Alex Rivera',
          role: 'Direttore del Barber Studio',
          location: 'Miami, USA',
          comment:
            'La masterclass di 8 ore di Antonio è tutta pratica, senza giri di parole. La community WhatsApp post-evento continua ad apportare un valore inestimabile.',
          rating: 5,
        },
        {
          name: 'Jean-Luc Moreau',
          role: 'Senior Stilista Maschile',
          location: 'Parigi, Francia',
          comment:
            'Un seminario internazionale di vero lusso. Il certificato firmato da Antonio è un sigillo di prestigio che espongo con orgoglio nel mio salone.',
          rating: 5,
        },
      ],
      sectionHeading: 'COSA DICONO I NOSTRI STUDENTI',
      countries: ['Messico', 'Colombia', 'Cile'],
    },
    faq: {
      badge: 'Chiarimenti e Risposte',
      title: 'Domande Frequenti',
      subtitle: 'Tutto ciò che devi sapere prima di assicurarti il tuo posto internazionale.',
      items: [
        {
          question: 'Come accedo alla diretta Zoom?',
          answer:
            'Subito dopo aver completato il pagamento, sarai reindirizzato al tuo portale di conferma con il link diretto a Zoom e l\'invito esclusivo al gruppo WhatsApp privato.',
        },
        {
          question: 'Quando e come ricevo il mio certificato ufficiale?',
          answer:
            'Al termine della masterclass in diretta, riceverai automaticamente via e-mail il Certificato Digitale in formato PDF ad alta risoluzione con il tuo nome completo e la firma ufficiale di Antonio Ferreira.',
        },
        {
          question: 'Quali metodi di pagamento sono accettati?',
          answer:
            'Accettiamo pagamenti internazionali sicuri in Dollari Americani (USD) tramite Stripe (Carte di Credito e Debito Visa, Mastercard, AMEX) e PayPal.',
        },
        {
          question: 'Cosa succede se non riesco a partecipare in diretta all\'orario previsto?',
          answer:
            'Tutti i partecipanti registrati avranno accesso alla registrazione in HD per 30 giorni dopo l\'evento, per rivedere ogni tecnica al proprio ritmo.',
        },
        {
          question: 'Come entro nella Community Privata di WhatsApp?',
          answer:
            'Il link di invito unico al gruppo privato viene sbloccato esclusivamente dopo la conferma del pagamento avvenuto con successo.',
        },
      ],
    },
    checkout: {
      title: 'Iscrizione Ufficiale al Seminario Internazionale',
      subtitle: 'Assicurati il tuo posto alla Masterclass dal Vivo di Antonio Ferreira',
      step1Title: '1. Dati del Partecipante',
      step2Title: '2. Selezione del Pagamento (USD)',
      step3Title: '3. Conferma & Accessi',
      fullName: 'Nome Completo (per il Certificato)',
      email: 'Indirizzo E-mail',
      phone: 'Telefono / WhatsApp (con prefisso internazionale)',
      country: 'Paese di Residenza',
      selectCountry: 'Seleziona il tuo paese...',
      paymentMethod: 'Metodo di Pagamento',
      payWithStripe: 'Carta di Credito / Debito (Stripe)',
      payWithPaypal: 'PayPal Express Checkout',
      cardNumber: 'Numero di Carta',
      cardExpiry: 'Scadenza (MM/AA)',
      cardCvc: 'Codice CVC',
      proceedToPayment: 'Procedi al Pagamento ($149 USD)',
      completePayment: 'Completa il Pagamento Sicuro ($149 USD)',
      processing: 'Elaborazione Iscrizione Sicura...',
      successTitle: 'Iscrizione Confermata con Successo!',
      successSubtitle: 'Benvenuto a Ferreira Academy. Il tuo posto ufficiale è stato riservato.',
      orderId: 'ID Transazione',
      joinWhatsapp: 'UNISCITI ALLA COMMUNITY ESCLUSIVA WHATSAPP',
      whatsappBadge: 'Accesso Consentito Esclusivamente Post-Pagamento',
      zoomDetails: 'Credenziali di Accesso Zoom',
      zoomDate: '15 Ottobre 2026 | 14:00 UTC',
      zoomLink: 'Link Sala Zoom HD',
      closeModal: 'Chiudi Portale',
      modalBadge: 'Seminario Internazionale dal Vivo 2026',
    },
    footer: {
      rights: '© 2026 Ferreira Academy. Tutti i diritti riservati.',
      privacy: 'Informativa sulla Privacy',
      terms: 'Termini e Condizioni',
      disclaimer:
        'Ferreira Academy è un marchio registrato di educazione internazionale nell\'alta barberia.',
      quickLinks: 'LINK RAPIDI',
      followUs: 'SEGUICI',
      securePlatform: 'PIATTAFORMA SICURA',
      paySafely: 'Paga in modo sicuro con:',
      globalPlatform: 'PIATTAFORMA GLOBALE DI FORMAZIONE PROFESSIONALE.',
      navLinks: ['Home', 'Benefici', 'Il Corso', 'Testimonianze', 'Contatto'],
    },
    cta: {
      bannerTitlePart1: 'IL TUO PROSSIMO LIVELLO',
      bannerTitlePart2: 'INIZIA QUI',
      bannerSubtitle:
        'Unisciti a centinaia di studenti che stanno già trasformando il loro talento in una carriera professionale.',
      button: 'ISCRIVITI ORA',
    },
  },

  // ─────────────────────────── FRANÇAIS ───────────────────────────
  fr: {
    nav: {
      home: 'Accueil',
      instructor: "L'Instructeur",
      benefits: 'Avantages',
      seminar: 'Le Séminaire',
      certificate: 'Certificat',
      faq: 'FAQ',
      selectLanguage: 'Langue',
    },
    hero: {
      badge: 'Masterclass Internationale 2026',
      titleLine1: 'Séminaire International de Haute Barberie',
      titleLine2: 'et Coupe Masculine d\'Élite',
      subtitle:
        'Apprenez les techniques avant-gardistes de coupe, de visagisme et de barberie exécutive en direct avec Antonio Ferreira. Maîtrisez le secteur et propulsez votre carrière à l\'échelle internationale.',
      ctaButton: 'S\'INSCRIRE MAINTENANT',
      quickStats: {
        countries: '+25 Pays Participants',
        zoomLive: 'Diffusion HD en Direct',
        certification: 'Signature Numérique Exclusive',
      },
      instructorTag: 'Antonio Ferreira',
      instructorSub: 'Master Educator & Barber Authority',
      academyLine1: 'ACADÉMIE INTERNATIONALE',
      academyLine2: 'DE COUPE MASCULINE ET BARBERIE PROFESSIONNELLE',
      headline1: 'MAÎTRISEZ L\'ART',
      headline2: 'TRANSFORMEZ VOTRE AVENIR',
      subtitleText: 'Apprenez les techniques modernes de coupe masculine et de barberie professionnelle avec Antonio Ferreira, depuis n\'importe où dans le monde.',
      securePayments: 'PAIEMENTS 100% SÉCURISÉS',
      stats: [
        { line1: 'COURS EN DIRECT', line2: 'VIA ZOOM' },
        { line1: 'ACCÈS PERMANENT', line2: 'AUX ENREGISTREMENTS' },
        { line1: 'CERTIFICATION', line2: 'NUMÉRIQUE' },
        { line1: 'COMMUNAUTÉ', line2: 'INTERNATIONALE' },
      ],
    },
    instructor: {
      badge: 'Autorité Internationale',
      title: 'Découvrez Antonio Ferreira',
      subtitle:
        'Référence mondiale dans l\'évolution du style masculin contemporain et de la haute barberie.',
      bio1: 'Fort de plus de 15 ans d\'expérience à la tête de scènes et de plateformes éducatives en Europe et en Amérique, Antonio Ferreira a révolutionné la coupe masculine de luxe en alliant géométrie classique et dynamisme moderne.',
      bio2: 'Sa méthodologie pratique et visionnaire a formé des milliers de barbiers professionnels qui dirigent aujourd\'hui les salons les plus prestigieux à l\'international.',
      stat1Label: 'Années d\'Expérience',
      stat1Value: '15+',
      stat2Label: 'Professionnels Certifiés',
      stat2Value: '+10 000',
      stat3Label: 'Pays Touchés',
      stat3Value: '35+',
      signatureLabel: 'Signature Officielle de Garantie Académique',
    },
    benefits: {
      badge: 'Pourquoi Participer',
      title: '6 Piliers de Transformation Professionnelle',
      subtitle:
        'Conçu pour les barbiers et stylistes qui cherchent à se démarquer sur un marché mondial hautement compétitif.',
      items: [
        {
          title: 'Techniques Modernes de Coupe',
          description:
            'Maîtrise des dégradés précis, des ciseaux avancés, de la texturation dynamique et du visagisme personnalisé pour chaque client.',
        },
        {
          title: 'Expérience Réelle et Cas Pratiques',
          description:
            'Démonstration étape par étape sur des modèles réels avec correction des angles et des structures en temps réel.',
        },
        {
          title: 'Croissance Professionnelle Accélérée',
          description:
            'Stratégies de personal branding, modèles de tarification premium et fidélisation de clients à haute valeur.',
        },
        {
          title: 'Réseau International Exclusif',
          description:
            'Rejoignez un réseau mondial d\'élite de barbiers pour des opportunités internationales et des échanges de connaissances.',
        },
        {
          title: 'Certification Numérique Officielle',
          description:
            'Validez votre formation avec un certificat à reconnaissance internationale portant la signature originale d\'Antonio Ferreira.',
        },
        {
          title: 'Accompagnement Personnalisé Post-Séminaire',
          description:
            'Accès exclusif à la communauté privée pour les questions, les retours détaillés et le mentorat continu.',
        },
      ],
      sectionHeading: 'POURQUOI ÉTUDIER À LA FERREIRA ACADEMY ?',
      shortTitles: [
        'TECHNIQUES\nMODERNES',
        'EXPÉRIENCE\nRÉELLE',
        'PROGRESSEZ\nPROFESSIONNELLEMENT',
        'DEPUIS N\'IMPORTE OÙ\nDANS LE MONDE',
        'CERTIFICATION\nNUMÉRIQUE',
        'ACCOMPAGNEMENT\nPERSONNALISÉ',
      ],
    },
    seminar: {
      badge: 'Détails du Séminaire',
      title: 'Masterclass Internationale : High-End Barbering 2026',
      subtitle:
        'Une journée intensive d\'immersion totale dans les techniques exécutives et la vision entrepreneuriale de la haute barberie.',
      dateLabel: 'Date Officielle',
      dateValue: '15 Octobre 2026',
      modalityLabel: 'Modalité',
      modalityValue: 'En Direct via Zoom HD',
      durationLabel: 'Durée Totale',
      durationValue: '8 HEURES',
      priceTag: 'Offre de Lancement Internationale',
      originalPrice: '$350 USD',
      currentPrice: '$149 USD',
      ctaButton: 'S\'INSCRIRE MAINTENANT',
      modulesTitle: 'Programme du Séminaire',
      modules: [
        {
          number: '01',
          title: 'Visagisme et Structure Crânienne',
          desc: 'Analyse morphopsychologique du visage pour concevoir des coupes adaptées à l\'anatomie de chaque client.',
        },
        {
          number: '02',
          title: 'Fondu Chirurgical & Texturation',
          desc: 'Techniques de suppression des lignes, d\'ombres polies et contrôle absolu des Ciseaux vs. Tondeuse.',
        },
        {
          number: '03',
          title: 'Barbothérapie & Styling Exécutif',
          desc: 'Rituel complet de profilage de la barbe avec serviettes chaudes et finition avec des produits haut de gamme.',
        },
        {
          number: '04',
          title: 'Personal Branding & Monétisation',
          desc: 'Comment appliquer des tarifs de luxe, créer du contenu à fort impact et développer votre marque à l\'échelle mondiale.',
        },
      ],
      liveBadge: 'COURS EN DIRECT',
      courseTitleLine1: 'COUPE MASCULINE',
      courseTitleLine2: 'ET BARBERIE PROFESSIONNELLE',
      checklist: [
        'Fondamentaux et techniques avancées de coupe masculine',
        'Dégradés, textures et finitions professionnelles',
        'Soin de la barbe et profilage',
        'Styling et tendances actuelles',
        'Sessions en direct + accès illimité aux enregistrements',
        'Certificat numérique à la fin',
      ],
    },
    certificate: {
      badge: 'Validité Internationale',
      title: 'Certificat Numérique Officiel',
      subtitle:
        'Soutenu par le sceau distinctif et la signature manuscrite officielle d\'Antonio Ferreira.',
      nameInputLabel: 'Visualisez votre nom sur le certificat :',
      placeholderName: 'Votre Nom Complet',
      downloadPdf: 'Télécharger l\'Exemple de Certificat PDF',
      officialBadge: 'Accréditation Vérifiée 2026',
      verificationText: 'Code QR d\'Authenticité Unique',
      signatory: 'Antonio Ferreira',
      titleRole: 'Fondateur & Master Director, Ferreira Academy',
    },
    testimonials: {
      badge: 'Témoignages de Réussite',
      title: 'Ce Que Disent Les Professionnels',
      subtitle:
        'Des barbiers du monde entier qui ont propulsé leur activité et leurs compétences au niveau supérieur.',
      items: [
        {
          name: 'Carlos Mendoza',
          role: 'Propriétaire & Master Barber',
          location: 'Madrid, Espagne',
          comment:
            'Apprendre avec Antonio Ferreira a radicalement amélioré la précision de mes coupes. Mes clients ont immédiatement remarqué la différence et j\'ai pu doubler mes tarifs.',
          rating: 5,
        },
        {
          name: 'Alex Rivera',
          role: 'Directeur du Barber Studio',
          location: 'Miami, États-Unis',
          comment:
            'La masterclass de 8 heures d\'Antonio est entièrement axée sur la pratique, sans détour. La communauté WhatsApp post-événement continue d\'apporter une valeur inestimable.',
          rating: 5,
        },
        {
          name: 'Jean-Luc Moreau',
          role: 'Styliste Masculin Senior',
          location: 'Paris, France',
          comment:
            'Un séminaire international de véritable luxe. Le certificat signé par Antonio est un gage de prestige que j\'affiche fièrement dans mon salon.',
          rating: 5,
        },
      ],
      sectionHeading: 'CE QUE DISENT NOS ÉTUDIANTS',
      countries: ['Mexique', 'Colombie', 'Chili'],
    },
    faq: {
      badge: 'Questions & Réponses',
      title: 'Foire Aux Questions',
      subtitle: 'Tout ce que vous devez savoir avant de réserver votre place internationale.',
      items: [
        {
          question: 'Comment accéder à la diffusion en direct sur Zoom ?',
          answer:
            'Immédiatement après avoir effectué votre paiement, vous serez redirigé vers votre portail de confirmation où vous obtiendrez le lien direct Zoom et l\'invitation exclusive au groupe WhatsApp.',
        },
        {
          question: 'Quand et comment est-ce que je reçois mon certificat officiel ?',
          answer:
            'Dès la fin du séminaire en direct, votre Certificat Numérique au format PDF haute résolution avec votre nom complet et la signature officielle d\'Antonio Ferreira vous sera envoyé automatiquement par e-mail.',
        },
        {
          question: 'Quels modes de paiement sont acceptés ?',
          answer:
            'Nous acceptons des paiements internationaux sécurisés en Dollars Américains (USD) via Stripe (Cartes de Crédit et Débit Visa, Mastercard, AMEX) et PayPal.',
        },
        {
          question: 'Que se passe-t-il si je ne peux pas assister en direct à l\'heure prévue ?',
          answer:
            'Tous les participants inscrits auront accès à l\'enregistrement en HD pendant 30 jours après l\'événement pour revoir chaque technique à leur propre rythme.',
        },
        {
          question: 'Comment rejoindre la Communauté Privée WhatsApp ?',
          answer:
            'Le lien d\'invitation unique au groupe privé est débloqué exclusivement après confirmation du paiement réussi dans le système.',
        },
      ],
    },
    checkout: {
      title: 'Inscription Officielle au Séminaire International',
      subtitle: 'Réservez votre place à la Masterclass en Direct d\'Antonio Ferreira',
      step1Title: '1. Informations du Participant',
      step2Title: '2. Sélection du Paiement (USD)',
      step3Title: '3. Confirmation & Accès',
      fullName: 'Nom Complet (pour le Certificat)',
      email: 'Adresse E-mail',
      phone: 'Téléphone / WhatsApp (avec indicatif pays)',
      country: 'Pays de Résidence',
      selectCountry: 'Sélectionnez votre pays...',
      paymentMethod: 'Mode de Paiement',
      payWithStripe: 'Carte de Crédit / Débit (Stripe)',
      payWithPaypal: 'PayPal Express Checkout',
      cardNumber: 'Numéro de Carte',
      cardExpiry: 'Expiration (MM/AA)',
      cardCvc: 'Code CVC',
      proceedToPayment: 'Procéder au Paiement ($149 USD)',
      completePayment: 'Finaliser le Paiement Sécurisé ($149 USD)',
      processing: 'Traitement de l\'Inscription Sécurisée...',
      successTitle: 'Inscription Confirmée avec Succès !',
      successSubtitle: 'Bienvenue à Ferreira Academy. Votre place officielle a été réservée.',
      orderId: 'ID de Transaction',
      joinWhatsapp: 'REJOINDRE LA COMMUNAUTÉ EXCLUSIVE WHATSAPP',
      whatsappBadge: 'Accès Accordé Exclusivement Après Paiement',
      zoomDetails: 'Identifiants d\'Accès Zoom',
      zoomDate: '15 Octobre 2026 | 14:00 UTC',
      zoomLink: 'Lien Salle Zoom HD',
      closeModal: 'Fermer le Portail',
      modalBadge: 'Séminaire International en Direct 2026',
    },
    footer: {
      rights: '© 2026 Ferreira Academy. Tous droits réservés.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions Générales',
      disclaimer:
        'Ferreira Academy est une marque déposée d\'éducation internationale en haute barberie.',
      quickLinks: 'LIENS RAPIDES',
      followUs: 'SUIVEZ-NOUS',
      securePlatform: 'PLATEFORME SÉCURISÉE',
      paySafely: 'Payez en toute sécurité avec :',
      globalPlatform: 'PLATEFORME MONDIALE DE FORMATION PROFESSIONNELLE.',
      navLinks: ['Accueil', 'Avantages', 'Le Cours', 'Témoignages', 'Contact'],
    },
    cta: {
      bannerTitlePart1: 'VOTRE PROCHAIN NIVEAU',
      bannerTitlePart2: 'COMMENCE ICI',
      bannerSubtitle:
        'Rejoignez des centaines d\'étudiants qui transforment déjà leur talent en une carrière professionnelle.',
      button: "S'INSCRIRE MAINTENANT",
    },
  },

// ─────────────────────────── DEUTSCH ───────────────────────────
    de: {
      nav: {
        home: 'Startseite',
        instructor: 'Der Dozent',
        benefits: 'Vorteile',
        seminar: 'Das Seminar',
        certificate: 'Zertifikat',
        faq: 'Häufige Fragen',
        selectLanguage: 'Sprache',
      },
      hero: {
        badge: 'Präsenz-Schulung 2026',
        titleLine1: 'Seminar für High-End-Barbering',
        titleLine2: 'Faded Mastery Elite',
        subtitle:
          'Fortgeschrittene Schulung für Profis: Fade-Techniken und Zeitoptimierung basierend auf der Schädelstruktur.',
        csaButton: 'JETZT ANMELDEN',
        quickStats: {
          countries: '+25 Teilnehmende Länder',
          zoomLive: 'Präsenzunterricht',
          certification: 'Exklusive Digitale Signatur',
        },
        instructorTag: 'Antonio Ferreira',
        instructorSub: 'Master Educator & Barber Authority',
        academyLine1: 'INTERNATIONALE AKADEMIE',
        academyLine2: 'FÜR HERRENHAARSCHNITT & PROFESSIONELLES BARBERING',
        headline1: 'MEISTERE DIE KUNST',
        headline2: 'TRANSFORMIERE DEINE ZUKUNFT',
        subtitleText: 'Fortgeschrittene Schulung für Profis: Fade-Techniken und Zeitoptimierung basierend auf der Schädelstruktur.',
        securePayments: '100% SICHERE ZAHLUNGEN',
        stats: [
          { line1: 'PRÄSENZ-', line2: 'UNTERRICHT' },
          { line1: 'TEILNAHME-', line2: 'ZERTIFIKAT' },
          { line1: 'COFFEE', line2: 'BREAK' },
          { line1: 'INTERNATIONALE', line2: 'COMMUNITY' },
        ],
      },
      instructor: {
        badge: 'Internationale Autorität',
        title: 'Entdecke Antonio Ferreira',
        subtitle:
          'Globale Referenz in der Entwicklung des zeitgenössischen Männer-Stylings und des Premium-Barberings.',
        bio1: 'Mit über 15 Jahren Erfahrung auf Bühnen und Bildungsplattformen in Europa und Amerika hat Antonio Ferreira das Konzept des luxuriösen Herrenhaarschnitts revolutioniert, indem er klassische Geometrie mit modernem Dynamismus verbindet.',
        bio2: 'Seine praktische und visionäre Methodik hat Tausende von professionellen Barbieren ausgebildet, die heute die renommiertesten Studios auf internationalem Niveau leiten.',
        stat1Label: 'Jahre Erfahrung',
        stat1Value: '15+',
        stat2Label: 'Zertifizierte Profis',
        stat2Value: '+10.000',
        stat3Label: 'Erreichte Länder',
        stat3Value: '35+',
        signatureLabel: 'Offizielle akademische Garantie-Signatur',
      },
      benefits: {
        badge: 'Warum Teilnehmen',
        title: '6 Säulen der professionellen Transformation',
        subtitle:
          'Konzipiert für Barbiere und Stylisten, die sich auf einem stark wettbewerbsorientierten globalen Markt abheben möchten.',
        items: [
          {
            title: 'Moderne Schnitttechniken',
            description:
              'Beherrschung von sauberen Verläufen, fortgeschrittenem Scherenhandwerk, dynamischer Texturierung und individuellem Visagismus für jeden Kunden.',
          },
          {
            title: 'Echte Praxis und Fallstudien',
            description:
              'Schritt-für-Schritt-Live-Demonstration an echten Modellen mit Echtzeit-Korrekturen von Winkeln und Strukturen.',
          },
          {
            title: 'Beschleunigtes Karrierewachstum',
            description:
              'Personal-Branding-Strategien, Premium-Preismodelle und Kundenbindung im Hochpreissegment.',
          },
          {
            title: 'Exklusives Internationales Netzwerk',
            description:
              'Tritt einem globalen Elite-Netzwerk von Barbieren bei, um internationale Chancen und Wissen auszutauschen.',
          },
          {
            title: 'Offizielle Digitale Zertifizierung',
            description:
              'Belege deine Ausbildung mit einem international anerkannten Zertifikat mit der Originalsignatur von Antonio Ferreira.',
          },
          {
            title: 'Personalisierte Nachbetreuung',
            description:
              'Exklusiver Zugang zur privaten Community für Fragen, detailliertes Feedback und fortlaufende Betreuung.',
          },
        ],
        sectionHeading: 'WARUM AN DER FERREIRA ACADEMY STUDIEREN?',
        shortTitles: [
          'MODERNE\nSCHNITTTECHNIKEN',
          'ECHTE\nPRAXIS',
          'WACHSE\nPROFESSIONELL',
          'VON ÜBERALL\nAUF DER WELT',
          'DIGITALE\nZERTIFIZIERUNG',
          'PERSONALISIERTE\nBETREUUNG',
        ],
      },
      seminar: {
        badge: 'Seminar-Details',
        title: 'FADED MASTERY ELITE',
        subtitle:
          'Fortgeschrittene Schulung für Profis: Fade-Techniken und Zeitoptimierung basierend auf der Schädelstruktur.',
        dateLabel: 'Offizielles Datum',
        dateValue: 'Sonntag, 09.08.2026',
        modalityLabel: 'Format',
        modalityValue: 'Präsenzunterricht',
        priceTag: 'Zertifizierung & Inklusion',
        originalPrice: '',
        currentPrice: '$80 USD',
        ctaButton: 'JETZT ANMELDEN',
        modulesTitle: 'Seminarprogramm',
        modules: [
          {
            number: '01',
            title: 'Visagismus & Schädelstruktur',
            desc: 'Morphopsychologische Gesichtsanalyse zur Gestaltung von Haarschnitten, die der Anatomie jedes Kunden entsprechen.',
          },
          {
            number: '02',
            title: 'Chirurgischer Fade & Texturierung',
            desc: 'Techniken zur Linienauflösung, polierten Übergängen und absoluter Kontrolle von Schere vs. Maschine.',
          },
          {
            number: '03',
            title: 'Bartpflege-Therapie & Executive-Styling',
            desc: 'Vollständiges Ritual zur Bartpflege mit heißen Handtüchern und Finish mit Produkten der Luxusklasse.',
          },
          {
            number: '04',
            title: 'Personal Branding & Monetarisierung',
            desc: 'Wie man Luxustarife verlangt, wirkungsvolle Inhalte erstellt und seine Marke global skaliert.',
          },
        ],
        liveBadge: 'PRÄSENZ',
        courseTitleLine1: 'FADED MASTERY',
        courseTitleLine2: 'ELITE',
        checklist: [
          'Teilnahmezertifikat',
          'Coffee Break',
          'Präsenzunterricht',
          'Sonntag, 09.08.2026',
        ],
      },
      certificate: {
        badge: 'Internationale Gültigkeit',
        title: 'Offizielles Digitales Zertifikat',
        subtitle:
          'Unterstützt durch das charakteristische Siegel und die offizielle handschriftliche Signatur von Antonio Ferreira.',
        nameInputLabel: 'Vorschau deines Namens auf dem Zertifikat:',
        placeholderName: 'Dein vollständiger Name',
        downloadPdf: 'Muster-PDF-Zertifikat herunterladen',
        officialBadge: 'Verifizierte Akkreditierung 2026',
        verificationText: 'Einzigartiger QR-Authentifizierungscode',
        signatory: 'Antonio Ferreira',
        titleRole: 'Gründer & Master Director, Ferreira Academy',
      },
      testimonials: {
        badge: 'Erfolgsgeschichten',
        title: 'Was Profis Sagen',
        subtitle:
          'Barbiere aus aller Welt, die ihre Unternehmen und Fähigkeiten auf die nächste Stufe gehoben haben.',
        items: [
          {
            name: 'Carlos Mendoza',
            role: 'Inhaber & Master Barber',
            location: 'Madrid, Spanien',
            comment:
              'Das Lernen mit Antonio Ferreira hat die Präzision meiner Schnitte drastisch verbessert. Meine Kunden bemerkten den Unterschied sofort und ich konnte meine Preise verdoppeln.',
            rating: 5,
          },
          {
            name: 'Alex Rivera',
            role: 'Barber Studio Direktor',
            location: 'Miami, USA',
            comment:
              'Antonios Live-Masterclass ist reine Praxis ohne Umschweife. Die Community nach dem Event liefert weiterhin unschätzbaren Mehrwert.',
            rating: 5,
          },
          {
            name: 'Jean-Luc Moreau',
            role: 'Senior Herren-Stylist',
            location: 'Paris, Frankreich',
            comment:
              'Ein wahrlich luxuriöses internationales Seminar. Das von Antonio signierte Zertifikat ist ein Prestigesiegel, das ich stolz in meinem Salon ausstelle.',
            rating: 5,
          },
        ],
        sectionHeading: 'WAS UNSERE STUDIERENDEN SAGEN',
        countries: ['Mexiko', 'Kolumbien', 'Chile'],
      },
      faq: {
        badge: 'Fragen & Antworten',
        title: 'Häufig Gestellte Fragen',
        subtitle: 'Alles, was du wissen musst, bevor du deinen internationalen Platz sicherst.',
        items: [
          {
            question: 'Wie nehme ich am Präsenzseminar teil?',
            answer:
              'Unmittelbar nach Abschluss deiner Zahlung wirst du zu deinem Bestätigungsportal weitergeleitet, wo du alle Details zum Veranstaltungsort und die exklusive Einladung zur WhatsApp-Gruppe erhältst.',
          },
          {
            question: 'Wann und wie erhalte ich mein offizielles Zertifikat?',
            answer:
              'Nach Ende des Seminars erhältst du automatisch per E-Mail dein hochauflösendes digitales PDF-Zertifikat mit deinem vollständigen Namen und der offiziellen Signatur von Antonio Ferreira.',
          },
          {
            question: 'Welche Zahlungsmethoden werden akzeptiert?',
            answer:
              'Wir akzeptieren sichere internationale Zahlungen in US-Dollar (USD) über Stripe (Kreditkarten und Debitkarten Visa, Mastercard, AMEX) und PayPal.',
          },
          {
            question: 'Was passiert, wenn ich nicht zum geplanten Termin teilnehmen kann?',
            answer:
              'Bitte kontaktiere unser Support-Team im Voraus, um deine Teilnahme auf den nächsten verfügbaren Termin zu verschieben.',
          },
          {
            question: 'Wie trete ich der privaten WhatsApp-Community bei?',
            answer:
              'Der einzigartige Einladungslink zur privaten Gruppe wird ausschließlich nach erfolgreicher Zahlungsbestätigung im System freigeschaltet.',
          },
        ],
      },
      checkout: {
        title: 'Offizielle Anmeldung zum Präsenzseminar',
        subtitle: 'Sichere dir deinen Platz bei Antonio Ferreiras Live-Schulung',
        step1Title: '1. Teilnehmer-Daten',
        step2Title: '2. Zahlungsauswahl (USD)',
        step3Title: '3. Bestätigung & Zugänge',
        fullName: 'Vollständiger Name (für Zertifikat)',
        email: 'E-Mail-Adresse',
        phone: 'Telefon / WhatsApp (mit Ländervorwahl)',
        country: 'Wohnsitzland',
        selectCountry: 'Wähle dein Land...',
        paymentMethod: 'Zahlungsmethode',
        payWithStripe: 'Kredit- / Debitkarte (Stripe)',
        payWithPaypal: 'PayPal Express Checkout',
        cardNumber: 'Kartennummer',
        cardExpiry: 'Ablaufdatum (MM/JJ)',
        cardCvc: 'CVC-Code',
        proceedToPayment: 'Weiter zur Zahlung ($80 USD)',
        completePayment: 'Sichere Zahlung abschließen ($80 USD)',
        processing: 'Sichere Anmeldung wird verarbeitet...',
        successTitle: 'Anmeldung erfolgreich bestätigt!',
        successSubtitle: 'Willkommen bei Ferreira Academy. Dein offizieller Platz wurde reserviert.',
        orderId: 'Transaktions-ID',
        joinWhatsapp: 'DER EXKLUSIVEN WHATSAPP-COMMUNITY BEITRETEN',
        whatsappBadge: 'Zugang ausschließlich nach Zahlung gewährt',
        zoomDetails: 'Veranstaltungsdetails',
        zoomDate: 'Sonntag, 09.08.2026',
        zoomLink: 'Standort- / Raum-Informationen',
        closeModal: 'Portal schließen',
        modalBadge: 'Präsenz-Seminar 2026',
      },
      footer: {
        rights: '© 2026 Ferreira Academy. Alle Rechte vorbehalten.',
        privacy: 'Datenschutzrichtlinie',
        terms: 'Allgemeine Geschäftsbedingungen',
        disclaimer:
          'Ferreira Academy ist eine eingetragene Marke für internationale Bildung im Premium-Barbering.',
        quickLinks: 'SCHNELL-LINKS',
        followUs: 'FOLGE UNS',
        securePlatform: 'SICHERE PLATTFORM',
        paySafely: 'Zahle sicher mit:',
        globalPlatform: 'GLOBALE PROFESSIONELLE AUSBILDUNGSPLATTFORM.',
        navLinks: ['Startseite', 'Vorteile', 'Der Kurs', 'Erfahrungsberichte', 'Kontakt'],
      },
      cta: {
        bannerTitlePart1: 'DEIN NÄCHSTES LEVEL',
        bannerTitlePart2: 'BEGINNT HIER',
        bannerSubtitle: 'Schließe dich Hunderten von Studierenden an, die ihr Talent bereits in eine professionelle Karriere verwandeln.',
        button: 'JETZT ANMELDEN',
      }
    }

  };