/**
 * currentCourse.ts
 * ─────────────────────────────────────────────────────────────────
 * Fuente única de verdad para los datos comerciales del curso activo.
 * Actualiza este archivo para reflejar cambios de precio, fecha, modalidad
 * o IDs de pago sin tocar los componentes ni las traducciones.
 * ─────────────────────────────────────────────────────────────────
 */

import { Language } from '@/lib/translations';

export interface CourseConfig {
  /** Nombre interno del curso */
  id: string;
  /** Nombre público del curso (ÚNICO, NO SE TRADUCE) */
  title: string;
  /** Alias para compatibilidad */
  name: string;
  /** Monto numérico del precio (en la moneda indicada, NO SE TRADUCE) */
  priceAmount: number;
  /** Código ISO de la moneda (NO SE TRADUCE) */
  currency: string;
  /** String formateado listo para mostrar en UI */
  displayPrice: string;
  /** Plan ID de PayPal (modo live o sandbox) */
  paypalPlanId: string;
  /** Fecha y hora de inicio del curso para el contador regresivo */
  startDate: string;
  /** Modalidad: true = Presencial (Coffee Break + Capacitación Presencial), false = Zoom */
  isPresencial: boolean;
}

export const currentCourse: CourseConfig = {
  id: 'faded-mastery-elite-2026',
  title: 'Faded Mastery Elite 2026',
  name: 'Faded Mastery Elite 2026',
  priceAmount: 1,
  currency: 'USD',
  displayPrice: '$1.00 USD',
  // ⚠️ Reemplaza con los IDs reales de tu dashboard de PayPal
  paypalPlanId: 'P-XXXXXXXXXXXXXXXXXXXXXXXXXX',
  startDate: '2026-10-15T18:00:00Z',
  isPresencial: true,
};

const WEEKDAYS: Record<Language, string[]> = {
  es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  pt: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  it: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
  fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
};

const MONTHS: Record<Language, string[]> = {
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
  fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
};

/**
 * Retorna la fecha formateada y traducida al idioma seleccionado
 * (traduce días de la semana y meses a los 6 idiomas).
 */
export function getFormattedCourseDate(lang: Language = 'es', dateStr: string = currentCourse.startDate): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const dayName = WEEKDAYS[lang]?.[date.getUTCDay()] || WEEKDAYS.es[date.getUTCDay()];
  const dayNum = date.getUTCDate();
  const monthName = MONTHS[lang]?.[date.getUTCMonth()] || MONTHS.es[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  switch (lang) {
    case 'en':
      return `${dayName}, ${monthName} ${dayNum}, ${year}`;
    case 'de':
      return `${dayName}, ${dayNum}. ${monthName} ${year}`;
    case 'fr':
    case 'it':
      return `${dayName} ${dayNum} ${monthName} ${year}`;
    case 'pt':
    case 'es':
    default:
      return `${dayName}, ${dayNum} de ${monthName} de ${year}`;
  }
}

/**
 * Retorna la configuración del curso a partir de su identificador.
 * Si no se provee courseId, retorna el curso activo por defecto.
 * Si el ID no existe en el catálogo, retorna null.
 */
export function getCourseById(courseId?: string): CourseConfig | null {
  if (!courseId) return currentCourse;
  if (courseId === currentCourse.id) return currentCourse;
  return null;
}

