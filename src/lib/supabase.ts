import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-domain.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY are set.'
    );
  }

  _adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: { 'x-client-info': 'ferreira-academy-admin' },
    },
  });

  return _adminClient;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  message?: string;
  field?: 'email' | 'phone' | 'both';
  existingRecord?: {
    id: string;
    certificate_name?: string;
    email?: string;
    phone?: string;
    course_name?: string;
  };
}

/**
 * Consulta la tabla 'registrations' para comprobar si ya existe un registro con
 * el mismo email o el mismo número de teléfono antes de cualquier inserción.
 */
export async function checkDuplicateRegistration(
  email: string,
  phone?: string | null,
  excludeOrderId?: string | null
): Promise<DuplicateCheckResult> {
  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedPhone = (phone || '').trim();

  if (!trimmedEmail && !trimmedPhone) {
    return { isDuplicate: false };
  }

  try {
    const admin = getSupabaseAdmin();

    // Consultar registros coincidentes por email o por teléfono
    let query = admin
      .from('registrations')
      .select('id, certificate_name, email, phone, course_name, paypal_order_id');

    if (trimmedEmail && trimmedPhone) {
      query = query.or(`email.ilike.${trimmedEmail},phone.eq.${trimmedPhone}`);
    } else if (trimmedEmail) {
      query = query.ilike('email', trimmedEmail);
    } else if (trimmedPhone) {
      query = query.eq('phone', trimmedPhone);
    }

    if (excludeOrderId) {
      query = query.neq('paypal_order_id', excludeOrderId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[checkDuplicateRegistration] Error al consultar duplicados en Supabase:', error);
      return { isDuplicate: false };
    }

    if (data && data.length > 0) {
      const match = data[0];
      const emailMatches = !!(trimmedEmail && match.email?.trim().toLowerCase() === trimmedEmail);
      const phoneMatches = !!(trimmedPhone && match.phone?.trim() === trimmedPhone);

      let field: 'email' | 'phone' | 'both' = 'email';
      if (emailMatches && phoneMatches) field = 'both';
      else if (phoneMatches) field = 'phone';

      console.warn(`[checkDuplicateRegistration] Duplicado detectado: email="${match.email}" phone="${match.phone}" (coincidencia: ${field})`);

      return {
        isDuplicate: true,
        field,
        message: 'Ya te encuentras registrado/a en este curso con este correo electrónico o número de teléfono.',
        existingRecord: {
          id: match.id,
          certificate_name: match.certificate_name,
          email: match.email,
          phone: match.phone,
          course_name: match.course_name,
        },
      };
    }

    return { isDuplicate: false };
  } catch (err) {
    console.error('[checkDuplicateRegistration] Excepción inesperada:', err);
    return { isDuplicate: false };
  }
}

export async function ensurePurchasesTable(): Promise<void> {
  return Promise.resolve();
}