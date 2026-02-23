create or replace function get_random_faces(count int)
returns setof face
language sql
as $$
  select * from face order by random() limit count;
$$;
