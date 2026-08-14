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
      let message = '';

      /*
       * CORREO Y TELÉFONO DUPLICADOS
       */
      if (check.emailDuplicate && check.phoneDuplicate) {
        message =
          'El correo electrónico y el número de teléfono ingresados ya están registrados para este curso.';
      }

      /*
       * SOLO CORREO DUPLICADO
       */
      else if (check.emailDuplicate) {
        message =
          'El correo electrónico ingresado ya está registrado para este curso.';
      }

      /*
       * SOLO TELÉFONO DUPLICADO
       */
      else if (check.phoneDuplicate) {
        message =
          'El número de teléfono ingresado ya está registrado para este curso.';
      }

      /*
       * Compatibilidad con la respuesta anterior,
       * por si la función todavía devuelve únicamente field/message.
       */
      else if (check.field === 'email') {
        message =
          'El correo electrónico ingresado ya está registrado para este curso.';
      }

      else if (check.field === 'phone') {
        message =
          'El número de teléfono ingresado ya está registrado para este curso.';
      }

      else if (check.field === 'both') {
        message =
          'El correo electrónico y el número de teléfono ingresados ya están registrados para este curso.';
      }

      else {
        message =
          'El correo electrónico o número de teléfono ingresado ya está registrado para este curso.';
      }

      return NextResponse.json(
        {
          isDuplicate: true,
          emailDuplicate: !!check.emailDuplicate,
          phoneDuplicate: !!check.phoneDuplicate,
          field: check.field,
          error: message,
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