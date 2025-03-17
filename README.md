
# Quantum Voting System

A quantum-resistant voting system built with React and Python Flask.

## GitHub Codespaces Development

This project is configured for GitHub Codespaces, which provides a complete development environment in the cloud.

### Using Codespaces

1. Click the green "Code" button in your GitHub repository
2. Select "Open with Codespaces"
3. Click "New codespace"
4. Wait for the environment to set up (this may take a few minutes)

When the codespace is ready, you'll have Python 3.11 and Node.js already installed.

### Running the Application in Codespaces

Open two terminal windows in your codespace:

**Terminal 1 (Backend)**:
```bash
cd backend
source venv/bin/activate
python app.py
```

**Terminal 2 (Frontend)**:
```bash
npm run dev
```

The frontend will be available on port 5173 and the backend on port 5000. Codespaces will prompt you to open these in your browser or forward them to your local machine.

## Project Structure

- `/src` - React frontend code
- `/backend` - Python Flask backend code

## Manual Setup

### Frontend Setup

```bash
# Install dependencies (using npm as the preferred package manager)
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

## Development

For local development, you can:

1. Set `VITE_USE_MOCK_DATA=true` in your `.env.local` file to use mock data without running the backend
2. Set `VITE_USE_MOCK_DATA=false` and run both frontend and backend to use the actual API

## Package Manager

This project uses npm as the preferred package manager. If you're experiencing issues with multiple lockfiles, you can:

1. Use VS Code settings to set npm as the default: Add `"npm.packageManager": "npm"` to your settings.json
2. Or delete any non-npm lockfiles (like bun.lockb) if you're not using them

## Building for Production

```bash
# Build the frontend
npm run build

# The built files will be in the dist/ directory
```

For the backend, follow proper Flask deployment practices using Gunicorn, uWSGI, or a similar WSGI server.
