CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    course_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    paypal_order_id TEXT NOT NULL,
    paypal_capture_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
