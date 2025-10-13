-- Create presale tier enum
CREATE TYPE public.presale_tier AS ENUM (
  'supporter',
  'early_access', 
  'founders_circle',
  'lifetime_founder',
  'equity_partner'
);

-- Create waitlist signups table
CREATE TABLE public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tier public.presale_tier NOT NULL DEFAULT 'supporter',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create presale purchases table
CREATE TABLE public.presale_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  tier public.presale_tier NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  amount_paid INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presale_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for waitlist_signups
CREATE POLICY "Anyone can insert waitlist signups"
  ON public.waitlist_signups
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own waitlist signup"
  ON public.waitlist_signups
  FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- RLS Policies for presale_purchases
CREATE POLICY "Anyone can insert presale purchases"
  ON public.presale_purchases
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own purchases"
  ON public.presale_purchases
  FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_waitlist_signups_updated_at
  BEFORE UPDATE ON public.waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_presale_purchases_updated_at
  BEFORE UPDATE ON public.presale_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();