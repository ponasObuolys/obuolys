-- Migration: Calculator Submissions Table
-- Created: 2025-11-02
-- Purpose: Store project calculator submissions with email collection for lead generation

-- Ensure required extension and trigger function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Trigger function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create calculator_submissions table
CREATE TABLE IF NOT EXISTS public.calculator_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact Info
  email text NOT NULL,
  company_name text,

  -- Project Data
  project_type text NOT NULL CHECK (project_type IN ('mvp', 'crm', 'ecommerce', 'logistics', 'analytics', 'custom')),
  features text[] NOT NULL DEFAULT '{}',

  -- Tech Stack Selections
  tech_stack_frontend text NOT NULL DEFAULT 'react-typescript' CHECK (tech_stack_frontend IN ('react-typescript', 'next-typescript')),
  tech_stack_backend text NOT NULL DEFAULT 'supabase' CHECK (tech_stack_backend IN ('supabase', 'custom-nodejs')),
  tech_stack_testing boolean NOT NULL DEFAULT false,
  tech_stack_premium_design boolean NOT NULL DEFAULT false,

  -- Calculated Estimate
  estimated_min_cost integer NOT NULL,
  estimated_max_cost integer NOT NULL,
  estimated_min_weeks integer NOT NULL,
  estimated_max_weeks integer NOT NULL,
  recommended_package text NOT NULL,

  -- Metadata
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,

  -- Email Status
  email_sent boolean DEFAULT false NOT NULL,
  email_sent_at timestamptz,
  email_error text,

  -- Lead Status
  lead_status text DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes text,

  -- Analytics
  ip_address inet,
  user_agent text,
  referrer text
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_calculator_submissions_email ON public.calculator_submissions(email);
CREATE INDEX IF NOT EXISTS idx_calculator_submissions_created_at ON public.calculator_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calculator_submissions_lead_status ON public.calculator_submissions(lead_status);
CREATE INDEX IF NOT EXISTS idx_calculator_submissions_email_sent ON public.calculator_submissions(email_sent);

-- Add trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.calculator_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.calculator_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public: Anyone can insert (for calculator submissions)
CREATE POLICY "Anyone can submit calculator data"
  ON public.calculator_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin: Full access to view and manage submissions
CREATE POLICY "Admins can view all submissions"
  ON public.calculator_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update submissions"
  ON public.calculator_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete submissions"
  ON public.calculator_submissions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Add comments for documentation
COMMENT ON TABLE public.calculator_submissions IS 'Stores project calculator submissions with email collection for lead generation';
COMMENT ON COLUMN public.calculator_submissions.email IS 'Contact email address (required)';
COMMENT ON COLUMN public.calculator_submissions.company_name IS 'Company name (optional)';
COMMENT ON COLUMN public.calculator_submissions.project_type IS 'Selected project type: mvp, crm, ecommerce, logistics, analytics, custom';
COMMENT ON COLUMN public.calculator_submissions.features IS 'Array of selected features: auth, realtime, fileUpload, payments, reports, mobileApp, apiIntegrations, customWorkflows';
COMMENT ON COLUMN public.calculator_submissions.estimated_min_cost IS 'Calculated minimum cost in EUR';
COMMENT ON COLUMN public.calculator_submissions.estimated_max_cost IS 'Calculated maximum cost in EUR';
COMMENT ON COLUMN public.calculator_submissions.lead_status IS 'Lead management status: new, contacted, qualified, converted, lost';
COMMENT ON COLUMN public.calculator_submissions.email_sent IS 'Whether the estimate PDF email was sent successfully';
