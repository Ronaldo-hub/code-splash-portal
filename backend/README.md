

# Quantum Voting System Backend

This directory contains the Python backend for the Quantum Voting System.

## Features

- Quantum-resistant cryptography for secure voting
- Algorand blockchain integration for transparent vote counting
- RESTful API for voting operations
- Support for both online and offline voting

## Setup Instructions

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

#### Installing Python 3.11 in GitHub Codespaces

If you need Python 3.11 specifically (which is recommended for this project), you can install it in GitHub Codespaces:

```bash
# Update package lists
sudo apt-get update

# Install required dependencies
sudo apt-get install -y build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev \
liblzma-dev

# Download and install Python 3.11
wget https://www.python.org/ftp/python/3.11.4/Python-3.11.4.tgz
tar -xf Python-3.11.4.tgz
cd Python-3.11.4
./configure --enable-optimizations
make -j$(nproc)
sudo make altinstall

# Verify installation
python3.11 --version
```

#### Important Note for Python 3.12 Users
If you encounter errors about missing 'distutils' module, you need to install it separately as it's no longer included in Python 3.12:

```bash
# For Ubuntu/Debian (including GitHub Codespaces)
sudo apt-get update
sudo apt-get install python3.12-distutils python3.12-dev

# For Fedora
sudo dnf install python3.12-devel

# For macOS with Homebrew
# This should be included with Homebrew's Python

# For Windows
# Re-run the Python installer and select "Modify", then ensure "pip" and 
# "Development Libraries" are selected to install
```

**GitHub Codespaces Alternative Solution**: If you continue to have issues with Python 3.12 in Codespaces, you can switch to Python 3.11:

```bash
# Check available Python versions
ls /usr/bin/python*

# Use Python 3.11 instead
python3.11 -m venv venv
source venv/bin/activate
```

### 2. Virtual Environment Setup

Create a virtual environment using one of these commands:
```bash
# If 'python' works on your system
python -m venv venv

# If you need to use python3 explicitly
python3 -m venv venv

# If using Python 3.11 specifically (recommended for compatibility)
python3.11 -m venv venv
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

## Troubleshooting

If you encounter package installation errors in GitHub Codespaces:

1. Try using Python 3.11 instead of 3.12:
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate
   ```

2. If specific packages fail to install, you may need to install build dependencies:
   ```bash
   sudo apt-get update
   sudo apt-get install build-essential libffi-dev
   ```

3. For qiskit-specific issues, try installing it separately:
   ```bash
   pip install qiskit==0.43.0 --no-deps
   pip install -r requirements.txt
   ```

