CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    buyer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    certificate_name TEXT NOT NULL,
    course_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL,
    paypal_order_id TEXT NOT NULL,
    payer_id TEXT,
    certificate_sent BOOLEAN DEFAULT false
);
