
# Quantum Voting System

A quantum-resistant voting system built with React and Python Flask.

## Project Structure

- `/src` - React frontend code
- `/backend` - Python Flask backend code

## Frontend Setup

```bash
# Install dependencies (using npm as the preferred package manager)
npm install

# Start development server
npm run dev
```

## Backend Setup

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
