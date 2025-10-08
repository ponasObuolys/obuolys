-- Create custom_tool_inquiries table for lead generation
create table if not exists custom_tool_inquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Contact information
  full_name text not null,
  email text not null,
  phone text,
  company_name text,
  company_size text check (company_size in ('small', 'medium', 'large', 'enterprise')),

  -- Project information
  project_type text not null check (project_type in ('crm', 'logistics', 'automation', 'analytics', 'scheduling', 'accounting', 'other')),
  budget_range text check (budget_range in ('under_5k', '5k_12k', '12k_25k', 'over_25k', 'not_sure')),
  timeline text check (timeline in ('urgent', '1_2_months', '2_3_months', 'flexible')),
  description text not null,

  -- Additional details
  current_solution text,
  team_size text,

  -- Status tracking
  status text default 'new' check (status in ('new', 'contacted', 'in_discussion', 'quoted', 'accepted', 'rejected', 'completed')),
  notes text,
  admin_notes text,

  -- Privacy
  gdpr_consent boolean default false not null,

  -- Metadata
  source text default 'website',
  ip_address text,
  user_agent text
);

-- Enable RLS
alter table custom_tool_inquiries enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can submit inquiry" on custom_tool_inquiries;
drop policy if exists "Authenticated users can view all inquiries" on custom_tool_inquiries;
drop policy if exists "Authenticated users can update inquiries" on custom_tool_inquiries;

-- Policy: Anyone can insert (public form submission)
create policy "Anyone can submit inquiry"
  on custom_tool_inquiries for insert
  with check (true);

-- Policy: Only authenticated users (admins) can view
create policy "Authenticated users can view all inquiries"
  on custom_tool_inquiries for select
  using (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update
create policy "Authenticated users can update inquiries"
  on custom_tool_inquiries for update
  using (auth.role() = 'authenticated');

-- Create indexes if they don't exist
create index if not exists custom_tool_inquiries_created_at_idx on custom_tool_inquiries(created_at desc);
create index if not exists custom_tool_inquiries_status_idx on custom_tool_inquiries(status);
create index if not exists custom_tool_inquiries_email_idx on custom_tool_inquiries(email);

-- Add comment
comment on table custom_tool_inquiries is 'Stores inquiries from custom tool development service page';
