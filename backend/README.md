
# Quantum Voting System Backend

This directory contains the Python backend for the Quantum Voting System.

## Features

- Quantum-resistant cryptography for secure voting
- Algorand blockchain integration for transparent vote counting
- RESTful API for voting operations
- Support for both online and offline voting

## Setup Instructions

If you're using GitHub Codespaces, Python 3.11 is already installed and the virtual environment is set up for you. Just activate it with:

```bash
source venv/bin/activate
```

### Manual Setup

If you're not using Codespaces, follow these steps:

### 1. Python Installation

If you get a "python command not found" error, you may need to:

- Check if Python is installed using `python3 --version` or `python --version`
- If not installed, install Python:
  ```bash
  # For Ubuntu/Debian
  sudo apt-get install python3
  
  # For Fedora
  sudo dnf install python3
  
  # For macOS with Homebrew
  brew install python
  
  # For Windows
  # Download and install from https://www.python.org/downloads/
  ```

### 2. Virtual Environment Setup

Create a virtual environment using one of these commands:
```bash
# If 'python' works on your system
python -m venv venv

# If you need to use python3 explicitly
python3 -m venv venv
```

Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux and GitHub Codespaces
source venv/bin/activate
```

### 3. Install dependencies:
```bash
# If pip works
pip install -r requirements.txt

# If you need to use pip3
pip3 install -r requirements.txt
```

### 4. Create a .env file:
```bash
cp .env.example .env
```

### 5. Edit the .env file with your configuration settings.

### 6. Run the Flask server:
```bash
# If python works
python app.py

# If you need to use python3
python3 app.py
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
