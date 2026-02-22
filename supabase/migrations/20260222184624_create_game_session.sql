CREATE TABLE IF NOT EXISTS public.game_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    face_ids UUID[] NOT NULL,
    completed_at TIMESTAMPTZ
);

ALTER TABLE public.game_session ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_insert_game_session"
    ON public.game_session FOR INSERT WITH CHECK (true);

CREATE POLICY "anyone_can_select_game_session"
    ON public.game_session FOR SELECT USING (true);

CREATE POLICY "anyone_can_update_game_session"
    ON public.game_session FOR UPDATE USING (true);
