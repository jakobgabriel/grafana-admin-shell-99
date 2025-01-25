-- Enable Row Level Security
ALTER TABLE IF EXISTS grafana_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for grafana_instances
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'grafana_instances' AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users"
        ON public.grafana_instances
        FOR SELECT
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'grafana_instances' AND policyname = 'Enable insert access for all users'
    ) THEN
        CREATE POLICY "Enable insert access for all users"
        ON public.grafana_instances
        FOR INSERT
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'grafana_instances' AND policyname = 'Enable update access for all users'
    ) THEN
        CREATE POLICY "Enable update access for all users"
        ON public.grafana_instances
        FOR UPDATE
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'grafana_instances' AND policyname = 'Enable delete access for all users'
    ) THEN
        CREATE POLICY "Enable delete access for all users"
        ON public.grafana_instances
        FOR DELETE
        USING (true);
    END IF;
END $$;

-- Create policies for user_interactions
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'user_interactions' AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users"
        ON public.user_interactions
        FOR SELECT
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'user_interactions' AND policyname = 'Enable insert access for all users'
    ) THEN
        CREATE POLICY "Enable insert access for all users"
        ON public.user_interactions
        FOR INSERT
        WITH CHECK (true);
    END IF;
END $$;

-- Create policies for user_roles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'user_roles' AND policyname = 'Users can view their own roles'
    ) THEN
        CREATE POLICY "Users can view their own roles"
        ON public.user_roles
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create admin user role for the current user if not exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'jakob.gabriel5@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;