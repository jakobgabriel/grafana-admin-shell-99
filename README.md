# Grafana Dashboard Explorer

A web application for managing and exploring Grafana dashboards across multiple instances. Built with React, TypeScript, and Supabase.

## Features

- View and manage multiple Grafana instances
- Browse folders and dashboards
- Filter by tags
- Import dashboard configurations
- Overview statistics and metrics

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Git](https://git-scm.com/)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Local Supabase

1. Start Supabase locally:
```bash
supabase start
```

2. Create the required tables using the following SQL:

```sql
-- Create grafana_instances table
CREATE TABLE public.grafana_instances (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
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
CREATE TABLE public.user_interactions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    event_type text NOT NULL,
    component text NOT NULL,
    details jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up RLS policies for grafana_instances
ALTER TABLE public.grafana_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
ON public.grafana_instances
FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users"
ON public.grafana_instances
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
ON public.grafana_instances
FOR UPDATE
USING (true);

CREATE POLICY "Enable delete access for all users"
ON public.grafana_instances
FOR DELETE
USING (true);

-- Set up RLS policies for user_interactions
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
ON public.user_interactions
FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users"
ON public.user_interactions
FOR INSERT
WITH CHECK (true);
```

3. Update the Supabase client configuration:

Create a `.env.local` file in the project root with your local Supabase credentials:

```env
VITE_SUPABASE_URL=<your-local-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-local-supabase-anon-key>
```

You can find these values by running:
```bash
supabase status
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── integrations/     # External service integrations
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Components

- `InstancesSection`: Main component for displaying Grafana instances
- `OverviewStats`: Statistics and metrics display
- `SearchAndTabs`: Search functionality and tab navigation
- `useGrafanaInstances`: Hook for managing Grafana instance data

## Deployment

### Production Deployment

1. Set up a production Supabase project
2. Update environment variables for production
3. Build and deploy:

```bash
npm run build
```

### Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.