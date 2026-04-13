create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamp default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  idea text,
  files jsonb,
  created_at timestamp default now()
);
