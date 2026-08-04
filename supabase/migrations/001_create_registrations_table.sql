CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    course_name TEXT NOT NULL DEFAULT 'Fade Mastery Elite',
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Índice único parcial: un solo registro pending por email
-- (permite múltiples completed para historial, pero solo 1 pending)
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_pending
    ON public.registrations (email)
    WHERE status = 'pending';

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Política para inserciones desde la API
CREATE POLICY "Allow public inserts" ON public.registrations
    FOR INSERT TO public WITH CHECK (true);

-- Política para updates desde service_role (limpieza + upsert)
CREATE POLICY "Allow service role updates" ON public.registrations
    FOR UPDATE USING (true) WITH CHECK (true);

-- Política para selects desde service_role (consulta de existencia)
CREATE POLICY "Allow service role selects" ON public.registrations
    FOR SELECT USING (true);

-- Política para deletes desde service_role (limpieza de abandonos)
CREATE POLICY "Allow service role deletes" ON public.registrations
    FOR DELETE USING (true);
