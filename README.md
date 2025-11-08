# Dev Service Dashboard

## Project Goal
The Dev Service Dashboard is an Electron-based desktop application designed to manage and run multiple development services/projects from a single interface. It allows you to start, stop, and monitor services, providing real-time status indicators and logs.

## Features
- Start and stop development projects with a single click.
- Real-time status indicator (green/red) for each project.
- Automatic handling of running processes.
- Configurable projects stored in `config/projects.json`.
- Cross-platform support via Electron.

<img width="1919" height="1025" alt="image" src="https://github.com/user-attachments/assets/29c39bd2-e1cd-4bb7-8325-010971a1d966" />


## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd dev-dashboard
```

2. ** Install dependencies
```bash
npm install
```

3. ** Configure environment variables: Create a .env file in the root directory
```bash
NODE_ENV=development
BASE_PROJECTS_PATH=C:/_projects
```

4. ** Configure projects: Edit config/projects.json to add your projects:
```bash
{
  "projects": [
    {
      "name": "Project Name",
      "cwd": "${BASE_PROJECTS_PATH}/project-ui",
      "cmd": "npm run dev",
      "env": "DEV"
    }
  ]
}
```

5. ** Run in development mode
```bash
npm start
```
