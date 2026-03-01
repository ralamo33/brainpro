DELETE FROM public.game_answer WHERE true;
DELETE FROM public.game_session WHERE true;
DELETE FROM public.face WHERE true;

CREATE TYPE GENDER AS ENUM ('MALE', 'FEMALE');
CREATE TYPE RACE AS ENUM ('East Asian', 'Indian', 'Black', 'White', 'Middle Eastern', 'Latino_Hispanic', 'Southeast Asian');

ALTER TABLE public.face ADD COLUMN IF NOT EXISTS gender gender NOT NULL;
ALTER TABLE public.face ADD COLUMN IF NOT EXISTS race race NOT NULL;
