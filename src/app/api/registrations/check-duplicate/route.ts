import { NextResponse } from 'next/server';
import { checkDuplicateRegistration } from '@/lib/supabase';

// POST /api/registrations/check-duplicate
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      phone?: string | null;
      courseName?: string;
      excludeOrderId?: string | null;
    };

    const {
      email,
      phone,
      courseName,
      excludeOrderId,
    } = body;

    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPhone = (phone || '').trim();

    if (!normalizedEmail && !normalizedPhone) {
      return NextResponse.json(
        {
          isDuplicate: false,
          error: 'Debes proporcionar al menos un correo o número de teléfono.',
        },
        { status: 400 }
      );
    }

    /*
     * Verificación de duplicados.
     *
     * IMPORTANTE:
     * La función checkDuplicateRegistration debe comprobar:
     *
     * - correo + curso
     * - teléfono + curso
     *
     * y devolver:
     *
     * {
     *   isDuplicate: boolean,
     *   emailDuplicate?: boolean,
     *   phoneDuplicate?: boolean,
     *   field?: 'email' | 'phone' | 'both',
     *   message?: string
     * }
     */
    const check = await checkDuplicateRegistration(
      normalizedEmail,
      normalizedPhone || null,
      excludeOrderId,
      courseName
    );

    if (check.isDuplicate) {
      const emailDuplicate =
        check.field === 'email' ||
        check.field === 'both' ||
        !!check.emailDuplicate;

      const phoneDuplicate =
        check.field === 'phone' ||
        check.field === 'both' ||
        !!check.phoneDuplicate;

      const field: 'email' | 'phone' | 'both' =
        check.field ||
        (emailDuplicate && phoneDuplicate
          ? 'both'
          : emailDuplicate
          ? 'email'
          : 'phone');

      return NextResponse.json(
        {
          isDuplicate: true,
          emailDuplicate,
          phoneDuplicate,
          field,
          error:
            field === 'both'
              ? 'El correo electrónico y el número de teléfono ingresados ya están registrados para este curso.'
              : field === 'email'
              ? 'El correo electrónico ingresado ya está registrado para este curso.'
              : 'El número de teléfono ingresado ya está registrado para este curso.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        isDuplicate: false,
        emailDuplicate: false,
        phoneDuplicate: false,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;

    console.error('[check-duplicate] Error inesperado:', err);

    return NextResponse.json(
      {
        isDuplicate: false,
        error: 'Error al verificar los datos de registro.',
        details: err.message,
      },
      { status: 500 }
    );
  }
}