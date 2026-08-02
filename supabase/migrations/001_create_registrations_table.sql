CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    course_name TEXT NOT NULL DEFAULT 'Fade Mastery Elite',
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed'
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir inserciones públicas (por ejemplo, desde la pasarela de pagos)
CREATE POLICY "Allow public inserts" ON public.registrations
    FOR INSERT
    TO public
    WITH CHECK (true);
