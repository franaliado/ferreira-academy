-- ─────────────────────────────────────────────────────────────
-- Migración incremental: añadir campos de pasarelas de pago a registrations
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.registrations
    ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
    -- Campos para Lemon Squeezy
    ADD COLUMN IF NOT EXISTS lemon_order_id TEXT,
    ADD COLUMN IF NOT EXISTS customer_id TEXT,
    ADD COLUMN IF NOT EXISTS order_number TEXT,
    -- Campos para PayPal (añadidos para que la tabla sirva para ambas pasarelas)
    ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
    ADD COLUMN IF NOT EXISTS payer_id TEXT;

-- Añadir restricciones UNIQUE para evitar inserciones duplicadas según la pasarela
ALTER TABLE public.registrations 
    ADD CONSTRAINT registrations_lemon_order_id_key UNIQUE (lemon_order_id);

ALTER TABLE public.registrations 
    ADD CONSTRAINT registrations_paypal_order_id_key UNIQUE (paypal_order_id);