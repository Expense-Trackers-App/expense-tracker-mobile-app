-- Run this in your Supabase SQL Editor to create the required tables

-- 1. Expenses Table
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  date text NOT NULL,
  "paymentMethod" text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own expenses" 
  ON public.expenses FOR ALL 
  USING (auth.uid() = user_id);


-- 2. Budgets Table
CREATE TABLE public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  category text NOT NULL,
  "limit" numeric NOT NULL,
  month text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own budgets" 
  ON public.budgets FOR ALL 
  USING (auth.uid() = user_id);


-- 3. Settings Table
CREATE TABLE public.settings (
  user_id uuid REFERENCES auth.users PRIMARY KEY,
  currency text DEFAULT 'USD',
  language text DEFAULT 'English',
  "darkMode" boolean DEFAULT true,
  notifications boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings" 
  ON public.settings FOR ALL 
  USING (auth.uid() = user_id);
