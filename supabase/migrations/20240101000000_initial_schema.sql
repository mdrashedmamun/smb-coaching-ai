-- 1. Profiles (Public/Private separation)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  subscription_tier text default 'free',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" 
on public.profiles for select 
using ( auth.uid() = id );

create policy "Users can update own profile" 
on public.profiles for update 
using ( auth.uid() = id );

-- 2. Business Context (The Core Data)
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) not null,
  
  -- Core Identity
  name text,
  business_type text, -- 'service_local', 'agency', etc.
  industry text,
  
  -- Module Inputs (JSONB for flexibility as per PRD)
  -- This creates the "Anchor" for the user's data.
  module_1_inputs jsonb, -- { headline, price, ... }
  module_2_inputs jsonb, -- { funnel_stages, leads, ... }
  
  -- Diagnostic Data (The new "Vitals")
  vitals jsonb, -- { revenue, margin, utilization }
  segments jsonb, -- [ { name, price, count } ]
  founder_context jsonb, -- { hours_per_week, emotional_driver, runway }
  
  updated_at timestamptz default now()
);

alter table public.businesses enable row level security;

create policy "Users can CRUD own business" 
on public.businesses for all 
using ( auth.uid() = user_id );

-- 3. Module Results (The AI Output)
create table public.module_results (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) not null,
  module_id integer not null,
  version integer default 1,
  
  -- The Prompt used (for debugging/verifiability)
  prompt_snapshot text,
  
  -- The AI Response
  ai_output jsonb, 
  
  created_at timestamptz default now()
);

alter table public.module_results enable row level security;

create policy "Users can view own results" 
on public.module_results for select 
using ( 
  exists ( 
    select 1 from public.businesses 
    where businesses.id = module_results.business_id 
    and businesses.user_id = auth.uid() 
  ) 
);

create policy "Users can insert own results" 
on public.module_results for insert 
with check ( 
  exists ( 
    select 1 from public.businesses 
    where businesses.id = module_results.business_id 
    and businesses.user_id = auth.uid() 
  ) 
);

-- 4. Trigger to auto-create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
