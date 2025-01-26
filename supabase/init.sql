-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create grafana_instances table
CREATE TABLE IF NOT EXISTS public.grafana_instances (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    url text NOT NULL,
    api_key text NOT NULL,
    folders integer DEFAULT 0 NOT NULL,
    dashboards integer DEFAULT 0 NOT NULL,
    folders_list jsonb DEFAULT '[]'::jsonb,
    dashboards_list jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_interactions table
CREATE TABLE IF NOT EXISTS public.user_interactions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type text NOT NULL,
    component text NOT NULL,
    details jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.grafana_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON public.grafana_instances
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.grafana_instances
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.grafana_instances
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.grafana_instances
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.user_interactions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.user_interactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;