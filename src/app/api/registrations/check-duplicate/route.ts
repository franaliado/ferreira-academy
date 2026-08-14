import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// POST /api/registrations/check-duplicate
// Verifica si ya existe un registro con el mismo email o teléfono para el mismo curso.
// Debe llamarse ANTES de crear la orden de PayPal.

interface CheckDuplicateBody {
  email?: string;
  phone?: string;
  courseName?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as CheckDuplicateBody;

    const email = (body.email || '').trim().toLowerCase();
    const phone = (body.phone || '').trim();
    const courseName = (body.courseName || '').trim();

    if (!courseName) {
      return NextResponse.json({ error: 'El nombre del curso es obligatorio.' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const courseNameLower = courseName.toLowerCase();

    let emailExists = false;
    let phoneExists = false;

    // ── Verificar duplicado por email + curso ──
    if (email) {
      const { data: emailMatch, error: emailErr } = await admin
        .from('registrations')
        .select('id')
        .ilike('email', email)
        .ilike('course_name', courseName)
        .maybeSingle();

      if (emailErr) {
        console.error('[check-duplicate] Error al consultar email:', emailErr.message);
        // En caso de error de DB, no bloqueamos al usuario (fail open)
        return NextResponse.json({ duplicate: false });
      }
      emailExists = !!emailMatch;
    }

    // ── Verificar duplicado por teléfono + curso ──
    if (phone) {
      const { data: phoneMatch, error: phoneErr } = await admin
        .from('registrations')
        .select('id')
        .eq('phone', phone)
        .ilike('course_name', courseName)
        .maybeSingle();

      if (phoneErr) {
        console.error('[check-duplicate] Error al consultar teléfono:', phoneErr.message);
        return NextResponse.json({ duplicate: false });
      }
      phoneExists = !!phoneMatch;
    }

    if (emailExists && phoneExists) {
      return NextResponse.json({
        duplicate: true,
        message: 'Este correo electrónico y número de teléfono ya están registrados para este curso.',
      });
    }

    if (emailExists) {
      return NextResponse.json({
        duplicate: true,
        message: 'Este correo electrónico ya está registrado para este curso.',
      });
    }

    if (phoneExists) {
      return NextResponse.json({
        duplicate: true,
        message: 'Este número de teléfono ya está registrado para este curso.',
      });
    }

    return NextResponse.json({ duplicate: false });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[check-duplicate] Error inesperado:', err.message);
    // Fail open: si hay un error inesperado, no bloqueamos el flujo del usuario
    return NextResponse.json({ duplicate: false });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/registrations/check-duplicate' });
}
