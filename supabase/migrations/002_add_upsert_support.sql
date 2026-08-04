-- ─────────────────────────────────────────────────────────────
-- Migración incremental: aplicar sobre la tabla existente.
-- Ejecutar en el SQL Editor de Supabase Dashboard si la tabla
-- ya fue creada con la migración 001.
-- ─────────────────────────────────────────────────────────────

-- 1. Añadir columna updated_at si no existe
ALTER TABLE public.registrations
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. Cambiar el default de status de 'completed' a 'pending'
ALTER TABLE public.registrations
    ALTER COLUMN status SET DEFAULT 'pending';

-- 3. Índice único parcial: solo 1 pending por email
--    (los completed se acumulan como historial normal)
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_pending
    ON public.registrations (email)
    WHERE status = 'pending';

-- 4. Limpiar duplicados pending existentes ANTES del índice
--    (conserva solo el más reciente por email)
DELETE FROM public.registrations a
    USING public.registrations b
    WHERE a.id < b.id
      AND a.email = b.email
      AND a.status = 'pending'
      AND b.status = 'pending';

-- 5. Políticas RLS para que service_role pueda SELECT/UPDATE/DELETE
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role updates' AND tablename = 'registrations') THEN
        CREATE POLICY "Allow service role updates" ON public.registrations FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role selects' AND tablename = 'registrations') THEN
        CREATE POLICY "Allow service role selects" ON public.registrations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role deletes' AND tablename = 'registrations') THEN
        CREATE POLICY "Allow service role deletes" ON public.registrations FOR DELETE USING (true);
    END IF;
END $$;
