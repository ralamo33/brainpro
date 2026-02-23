ALTER TABLE public.game_session
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_game_session_user_id ON public.game_session (user_id);

CREATE OR REPLACE FUNCTION get_user_session_stats()
RETURNS TABLE(
  id UUID,
  created_at TIMESTAMPTZ,
  face_count INT,
  correct INT,
  total INT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    gs.id,
    gs.created_at,
    array_length(gs.face_ids, 1)::INT AS face_count,
    COUNT(ga.id) FILTER (WHERE ga.is_correct)::INT AS correct,
    COUNT(ga.id)::INT AS total
  FROM game_session gs
  LEFT JOIN game_answer ga ON ga.session_id = gs.id
  WHERE gs.user_id = auth.uid()
  GROUP BY gs.id, gs.created_at, gs.face_ids
  ORDER BY gs.created_at DESC;
$$;
