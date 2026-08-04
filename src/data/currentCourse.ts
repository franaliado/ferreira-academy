/**
 * currentCourse.ts
 * ─────────────────────────────────────────────────────────────────
 * Fuente única de verdad para los datos comerciales del curso activo.
 * Actualiza este archivo para reflejar cambios de precio o IDs de pago
 * sin tocar los componentes ni las traducciones.
 * ─────────────────────────────────────────────────────────────────
 */

export interface CourseConfig {
  /** Nombre interno del curso */
  id: string;
  /** Nombre público del curso */
  title: string;
  /** Monto numérico del precio (en la moneda indicada) */
  priceAmount: number;
  /** Código ISO de la moneda */
  currency: string;
  /** String formateado listo para mostrar en UI */
  displayPrice: string;
  /** Plan ID de PayPal (modo live o sandbox) */
  paypalPlanId: string;
  /** Fecha y hora de inicio del curso para el contador regresivo */
  startDate: string;
}

export const currentCourse: CourseConfig = {
  id: 'faded-mastery-elite-2026',
  title: 'Seminario de Alta Barbería: Faded Mastery Elite 2026',
  priceAmount: 95,
  currency: 'USD',
  displayPrice: '$95 USD',
  // ⚠️ Reemplaza con los IDs reales de tu dashboard de PayPal
  paypalPlanId: 'P-XXXXXXXXXXXXXXXXXXXXXXXXXX',
  startDate: '2026-10-15T18:00:00Z',
};
