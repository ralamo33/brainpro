CREATE TABLE IF NOT EXISTS public.number_session (
    id UUID default gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ default now() NOT NULL,
    number VARCHAR NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.number_answer (
    id UUID default gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ default now(),
    number_session_id UUID REFERENCES public.number_session(id),
    answer VARCHAR NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);
