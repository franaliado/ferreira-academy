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
  /** Monto numérico del precio (en la moneda indicada) */
  priceAmount: number;
  /** Código ISO de la moneda */
  currency: string;
  /** String formateado listo para mostrar en UI */
  displayPrice: string;
  /** Price ID de Stripe (modo live o test) */
  stripePriceId: string;
  /** Plan ID de PayPal (modo live o sandbox) */
  paypalPlanId: string;
}

export const currentCourse: CourseConfig = {
  id: 'faded-mastery-elite-2026',
  priceAmount: 95,
  currency: 'USD',
  displayPrice: '$95 USD',
  // ⚠️ Reemplaza con los IDs reales de tu dashboard de Stripe y PayPal
  stripePriceId: 'price_XXXXXXXXXXXXXXXXXXXXXXXXXX',
  paypalPlanId: 'P-XXXXXXXXXXXXXXXXXXXXXXXXXX',
};
