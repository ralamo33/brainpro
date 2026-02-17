CREATE TABLE IF NOT EXISTS public.face (
    id UUID primary key default gen_random_uuid(),
    created_at TIMESTAMPTZ default now() not null,
    file_path TEXT unique not null,
    name TEXT not null
);

CREATE INDEX IF NOT EXISTS idx_face_file_path
    ON public.face (file_path);

CREATE INDEX IF NOT EXISTS idx_face_name
    ON public.face (name);

ALTER TABLE public.face ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "everyone_can_view_faces" ON public.face;
CREATE POLICY "everyone_can_view_faces"
    ON public.face
    FOR SELECT
    USING (true);
