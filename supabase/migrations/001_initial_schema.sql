-- Email-to-Task Application Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS & SUBSCRIPTIONS
-- ============================================

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text default 'inactive', -- inactive, active, past_due, canceled
  subscription_price_id text,
  subscription_current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table emails (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  from_email text not null,
  subject text not null,
  body text not null,
  parsed_content jsonb, -- structured task data if parsed
  status text default 'pending', -- pending, processed, failed
  processed_at timestamptz,
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  email_id uuid references emails(id) on delete set null,
  title text not null,
  description text,
  priority text default 'medium', -- low, medium, high, urgent
  status text default 'todo', -- todo, in_progress, completed, archived
  due_date timestamptz,
  tags text[],
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table email_forwarding_addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  address text unique not null, -- e.g., user123@beta.irhuman.ai
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_emails_user_id on emails(user_id);
create index idx_emails_status on emails(status);
create index idx_tasks_user_id on tasks(user_id);
create index idx_tasks_status on tasks(status);
create index idx_tasks_due_date on tasks(due_date);
create index idx_tasks_priority on tasks(priority);
create index idx_profiles_stripe_customer on profiles(stripe_customer_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table profiles enable row level security;
alter table emails enable row level security;
alter table tasks enable row level security;
alter table email_forwarding_addresses enable row level security;

-- Profiles: Users can only see their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Emails: Users can only see their own emails
create policy "Users can view own emails"
  on emails for select
  using (auth.uid() = user_id);

create policy "Users can insert own emails"
  on emails for insert
  with check (auth.uid() = user_id);

-- Tasks: Users can only see their own tasks
create policy "Users can view own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

-- Email forwarding addresses: Users can only see their own
create policy "Users can view own forwarding addresses"
  on email_forwarding_addresses for select
  using (auth.uid() = user_id);

create policy "Users can insert own forwarding addresses"
  on email_forwarding_addresses for insert
  with check (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update timestamp on row update
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_tasks_updated_at
  before update on tasks
  for each row execute procedure update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get user's task statistics
create or replace function get_user_task_stats(user_uuid uuid)
returns table (
  total_tasks bigint,
  completed_tasks bigint,
  pending_tasks bigint,
  overdue_tasks bigint
) as $$
begin
  return query
  select
    count(*) filter (where 1=1) as total_tasks,
    count(*) filter (where status = 'completed') as completed_tasks,
    count(*) filter (where status in ('todo', 'in_progress')) as pending_tasks,
    count(*) filter (where status != 'completed' and due_date < now()) as overdue_tasks
  from tasks
  where user_id = user_uuid;
end;
$$ language plpgsql security definer;

-- ============================================
-- INITIAL DATA (Optional - for testing)
-- ============================================

-- Create sample Stripe prices (you'll need to create these in Stripe Dashboard)
-- Price 1: $9/month
-- Price 2: $29/month (Pro)
