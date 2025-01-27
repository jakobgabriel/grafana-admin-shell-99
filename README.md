# Grafana Dashboard Explorer (GitHub Version)

A static web application for exploring Grafana dashboards across multiple instances. Built with React and TypeScript, designed to be hosted on GitHub Pages.

## Overview

This application allows you to:
- View Grafana dashboards from multiple instances
- Browse folders and dashboards
- Filter by tags
- View deployment matrices and statistics

## Setup Instructions

1. Fork this repository

2. Create your data file:
   - Create a file named `grafana-data.json` in your repository
   - Format it according to the example below:
   ```json
   [
     {
       "name": "Production Grafana",
       "url": "https://your-grafana-url",
       "folders_list": [
         { "id": "1", "title": "System Monitoring" }
       ],
       "dashboards_list": [
         {
           "title": "System Overview",
           "description": "System metrics dashboard",
           "url": "https://your-grafana-url/d/abc",
           "tags": ["system", "monitoring"],
           "folderId": "1"
         }
       ]
     }
   ]
   ```

3. Configure GitHub Pages:
   - Go to your repository settings
   - Navigate to Pages section
   - Select 'GitHub Actions' as the source
   - Choose the main/master branch and /docs folder

4. Update the repository URL:
   - Open `src/hooks/useGrafanaInstances.ts`
   - Update the repository path in `fetchGrafanaData('your-username/your-repo')`

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to GitHub Pages.

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.