
# Quantum Voting System

A quantum-resistant voting system built with React and Python Flask.

## Project Structure

- `/src` - React frontend code
- `/backend` - Python Flask backend code

## Frontend Setup

```bash
# Install dependencies
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

## Building for Production

```bash
# Build the frontend
npm run build

# The built files will be in the dist/ directory
```

For the backend, follow proper Flask deployment practices using Gunicorn, uWSGI, or a similar WSGI server.
