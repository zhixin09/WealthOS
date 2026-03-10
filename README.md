# WealthOS

WealthOS is a prototype portfolio intelligence platform for wealth and asset management workflows.

This repo includes:

- a Next.js frontend
- a small FastAPI orchestrator backend
- mock portfolio data for the dashboard
- seeded research, planning, and alerts workflows

## Setup Guide

This guide is written for someone starting from a blank macOS machine.

If you already have `git`, Homebrew, `nvm`, Node.js `22`, and Python `3.11+`, you can skip to [Clone The Repo](#clone-the-repo).

## What You Need Installed

Install these tools first:

- Git
- Homebrew
- `nvm`
- Node.js `22`
- Python `3.11+`

## Install The Base Tools On macOS

### 1. Install Apple command line tools

```bash
xcode-select --install
```

### 2. Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3. Install Git, `nvm`, and Python

```bash
brew install git nvm python@3.11
```

### 4. Configure `nvm` for the default macOS shell

```bash
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$(brew --prefix nvm)/nvm.sh" ] && . "$(brew --prefix nvm)/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
```

### 5. Check the tools are available

```bash
git --version
brew --version
nvm --version
python3.11 --version
```

## Clone The Repo

```bash
git clone https://github.com/zhixin09/WealthOS.git
cd WealthOS
```

## Install The Frontend

The repo pins Node.js `22` in [`.nvmrc`](.nvmrc).

```bash
nvm install 22
nvm use 22
npm install
```

## Install The Backend

Create a Python virtual environment and install the backend dependencies:

```bash
cd services/orchestrator
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -e ".[dev]"
cd ../..
```

## Run The App

Open two Terminal windows or tabs.

### Terminal 1: start the backend

```bash
cd /path/to/WealthOS/services/orchestrator
source .venv/bin/activate
python -m uvicorn app.main:app --reload --port 8000
```

### Terminal 2: start the frontend

```bash
cd /path/to/WealthOS
source ~/.zshrc
nvm use 22
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The frontend calls the backend at `http://127.0.0.1:8000` by default.

## Verify It Worked

Once both servers are running, these routes should load:

- `/` for the dashboard
- `/research` for research Q&A
- `/planning` for planning scenarios
- `/alerts` for alert workflows

## Useful Commands

From the repo root:

```bash
npm run dev
npm run lint
npm run build
npm run start
```

From `services/orchestrator/`:

```bash
source .venv/bin/activate
python -m pytest -q
python -m uvicorn app.main:app --reload --port 8000
```

## Troubleshooting

### `nvm: command not found`

Run:

```bash
source ~/.zshrc
```

If that does not work, open a new Terminal window and try again.

### `nvm use` says Node `22` is not installed

Run:

```bash
nvm install 22
nvm use 22
```

### `python3.11: command not found`

Run:

```bash
brew install python@3.11
```

Then check:

```bash
python3.11 --version
```

### `npm run dev` renders unstyled HTML

Use the default webpack dev server:

```bash
npm run dev
```

Avoid `npm run dev:turbopack` for now. On this project, Turbopack can serve a broken CSS URL and leave the app unstyled.

### `npm run start` fails with `routesManifest.dataRoutes is not iterable`

That usually means the production build is stale or incomplete.

Run:

```bash
rm -rf .next
npm run build
npm run start
```

### Build fails with `Cannot find module '../lightningcss.darwin-arm64.node'`

That usually means packages were installed under the wrong Node.js version or architecture.

Run:

```bash
nvm use 22
rm -rf node_modules
npm install
npm run build
```

### Port `3000` is already in use

Stop the other Next.js server or let Next.js choose another port automatically.

## Project Structure

```text
src/
  app/                  Route entrypoints and API routes
  components/
    dashboard/          Dashboard-specific widgets
    shared/             Shared shell components
    ui/                 Reusable UI primitives
  data/                 Mock JSON fixtures
  lib/                  Shared frontend helpers
services/
  orchestrator/         FastAPI backend for workflow orchestration
docs/
  worklog.md            Lightweight handoff log
```

## Repo Notes

- Mock portfolio data lives in `src/data/`.
- The orchestrator backend lives in `services/orchestrator/`.
- Optional market-data environment variables can be added later if needed, but the demo works without them.
- Collaboration rules live in [AGENTS.md](AGENTS.md).
