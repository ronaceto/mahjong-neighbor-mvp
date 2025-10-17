-- Sessions
create table if not exists session (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  location_text text not null,
  seats int not null check (seats >= 1),
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_session_start on session(start_at);

-- Signups
create table if not exists signup (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references session(id) on delete cascade,
  name text not null,
  email text not null,
  status text not null default 'confirmed' check (status in ('confirmed','waitlist','cancelled')),
  seat_number int,
  created_at timestamptz default now(),
  unique(session_id, email)
);
create index if not exists idx_signup_status on signup(status);

-- Seed two demo sessions
insert into session (title,start_at,end_at,location_text,seats,notes)
values
('Learners Night: Reading the Card + Charleston',
 now() + interval '3 days' + interval '18 hours 30 minutes',
 now() + interval '3 days' + interval '20 hours 30 minutes',
 'Bentwood Creek Clubhouse', 8,
 'Please arrive 10 minutes early. Bring your NMJL card if you have one.'),
('Casual Play Friday',
 now() + interval '10 days' + interval '19 hours',
 now() + interval '10 days' + interval '21 hours',
 'Neighborhood Clubhouse', 4,
 'Snacks welcome. We''ll rotate seats each round.')
on conflict do nothing;
