CREATE TABLE IF NOT EXISTS public.game_answer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    session_id UUID NOT NULL REFERENCES public.game_session(id) ON DELETE CASCADE,
    face_id UUID NOT NULL REFERENCES public.face(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_game_answer_session_id ON public.game_answer (session_id);

ALTER TABLE public.game_answer ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_can_insert_game_answer" ON public.game_answer;
CREATE POLICY "anyone_can_insert_game_answer"
    ON public.game_answer FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "anyone_can_select_game_answer" ON public.game_answer;
CREATE POLICY "anyone_can_select_game_answer"
    ON public.game_answer FOR SELECT USING (true);
