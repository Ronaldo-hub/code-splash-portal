
# Quantum Voting System Backend

This directory contains the Python backend for the Quantum Voting System.

## Features

- Quantum-resistant cryptography for secure voting
- Algorand blockchain integration for transparent vote counting
- RESTful API for voting operations
- Support for both online and offline voting

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a .env file:
```bash
cp .env.example .env
```

5. Edit the .env file with your configuration settings.

6. Run the Flask server:
```bash
python app.py
```

The server will start on http://localhost:5000 by default.

## API Endpoints

- `/register` - Register a new voter
- `/create-election` - Create a new election
- `/add-proposal` - Add a proposal to an election
- `/cast-vote` - Cast a vote in an election
- `/offline-vote` - Submit a vote created offline
- `/results` - Get election results

## Modules

- `config.py` - Configuration settings
- `quantum.py` - Quantum-resistant cryptography
- `blockchain.py` - Algorand blockchain integration
- `voting.py` - Core voting logic
- `app.py` - Flask API

## Testing

For testing, you can use the mock data mode in the frontend by setting `VITE_USE_MOCK_DATA=true` in the frontend's `.env.local` file.
