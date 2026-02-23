CREATE OR REPLACE FUNCTION get_unseen_random_faces(count int)
RETURNS SETOF face
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT f.* FROM face f
  WHERE
    auth.uid() IS NULL
    OR f.id NOT IN (
      SELECT UNNEST(gs.face_ids)
      FROM game_session gs
      WHERE gs.user_id = auth.uid()
    )
  ORDER BY random()
  LIMIT count;
$$;
