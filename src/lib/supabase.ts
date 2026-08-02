import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Public Client (browser / client-side) ───────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-domain.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

// ─── Admin Client (server-side only — uses Service Role Key) ─────────
// This client bypasses RLS and has full admin access.
// ONLY use in API routes / server-side code (never expose to the browser).
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
  });

  return _adminClient;
}

// ─── Auto-create "purchases" table if it doesn't exist ───────────────
// Uses the Supabase admin client to run raw SQL via rpc or direct insert
// that silently succeeds even when the table already exists.
let _tableEnsured = false;

export async function ensurePurchasesTable(): Promise<void> {
  if (_tableEnsured) return;

  try {
    const admin = getSupabaseAdmin();

    // 1. Probe & ensure registrations table
    const { error: probeRegistrationsError } = await admin
      .from('registrations')
      .select('id')
      .limit(1);

    if (probeRegistrationsError && probeRegistrationsError.message.includes('does not exist')) {
      const { error: createError } = await admin.rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS public.registrations (
            id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            created_at      TIMESTAMPTZ DEFAULT NOW(),
            full_name       TEXT NOT NULL,
            email           TEXT NOT NULL,
            phone           TEXT,
            country         TEXT,
            payment_method  TEXT NOT NULL,
            course_name     TEXT DEFAULT 'Fade Mastery Elite',
            amount          NUMERIC(10,2) NOT NULL,
            status          TEXT DEFAULT 'completed'
          );
        `,
      });

      if (createError) {
        console.warn(
          '[Supabase] Could not auto-create "registrations" table via RPC. ' +
          'Please verify table existence in Supabase dashboard. Error:',
          createError.message
        );
      } else {
        console.log('[Supabase] "registrations" table created successfully.');
      }
    }

    // 2. Probe & ensure purchases table
    const { error: probeError } = await admin
      .from('purchases')
      .select('id')
      .limit(1);

    if (probeError && probeError.message.includes('does not exist')) {
      const { error: createError } = await admin.rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS public.purchases (
            id              BIGSERIAL PRIMARY KEY,
            order_id        TEXT UNIQUE NOT NULL,
            customer_name   TEXT,
            customer_email  TEXT,
            phone           TEXT,
            country         TEXT,
            payment_method  TEXT DEFAULT 'lemon_squeezy',
            transaction_id  TEXT,
            amount          NUMERIC(10,2),
            currency        TEXT DEFAULT 'USD',
            status          TEXT DEFAULT 'completed',
            lemon_order_id  TEXT,
            variant_id      TEXT,
            product_name    TEXT,
            raw_payload     JSONB,
            created_at      TIMESTAMPTZ DEFAULT NOW(),
            updated_at      TIMESTAMPTZ DEFAULT NOW()
          );
        `,
      });

      if (createError) {
        console.warn(
          '[Supabase] Could not auto-create "purchases" table. Error:',
          createError.message
        );
      } else {
        console.log('[Supabase] "purchases" table created successfully.');
      }
    }

    _tableEnsured = true;
  } catch (err) {
    console.warn('[Supabase] ensurePurchasesTable check failed:', err);
    _tableEnsured = true;
  }
}
