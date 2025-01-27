# Grafana Dashboard Explorer

A web application for managing and exploring Grafana dashboards across multiple instances. Built with React, TypeScript, and Supabase.

## Features

- View and manage multiple Grafana instances
- Browse folders and dashboards
- Filter by tags
- Import dashboard configurations
- Overview statistics and metrics
- Role-based access control (admin required for adding instances)

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for containerized deployment)
- [Git](https://git-scm.com/)

## Quick Start with Docker

The easiest way to get started is using Docker Compose:

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the application:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:8080`

## Local Development Setup

If you prefer to run the application without Docker:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Local Supabase

1. Start Supabase locally:
```bash
supabase start
```

2. Create the required tables using the SQL from the setup instructions.

3. Update the Supabase client configuration:

Create a `.env.local` file in the project root with your local Supabase credentials:

```env
VITE_SUPABASE_URL=<your-local-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-local-supabase-anon-key>
```

### 3. Start the Development Server

```bash
npm run dev
```

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── integrations/     # External service integrations
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## User Roles and Permissions

The application uses role-based access control:

- **Admin Users**: Can add, edit, and remove Grafana instances
- **Regular Users**: Can view and explore existing dashboards

To grant admin access:
1. Access your Supabase database
2. Insert a record in the `user_roles` table with:
   - user_id: The user's UUID
   - role: 'admin'

## Deployment Options

### 1. Docker Deployment (Recommended)

The application can be deployed using Docker Compose:

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### 2. Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the contents of the `dist` directory to your web server.

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Supabase credentials:
```env
# Get these values from your Supabase project settings
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Set a secure password for the local Supabase instance
POSTGRES_PASSWORD=your-super-secret-password
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.