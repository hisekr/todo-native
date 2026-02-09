create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.todos enable row level security;

create policy "Users manage own todos"
on public.todos
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
