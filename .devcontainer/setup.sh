
#!/bin/bash
set -e

echo "Setting up development environment..."

# Set up backend
cd /workspaces/$(basename $(pwd))/backend
# Check if venv exists, if not create it
if [ ! -d "venv" ]; then
    echo "Creating new Python virtual environment..."
    python -m venv venv
else
    echo "Virtual environment already exists."
fi

# Activate the virtual environment and install packages
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
    pip install --upgrade pip
    echo "Installing Python packages..."
    pip install -r requirements.txt
    echo "Backend packages installed:"
    pip list
    deactivate
else
    echo "ERROR: Virtual environment activation file not found!"
    echo "Trying to create a new virtual environment..."
    rm -rf venv
    python -m venv venv
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        pip list
        deactivate
    else
        echo "ERROR: Failed to create virtual environment. Please check your Python installation."
    fi
fi

# Set up frontend
cd /workspaces/$(basename $(pwd))
echo "Installing frontend packages..."
npm install
echo "Frontend packages installed"

echo "Setup completed successfully!"
echo "To run the backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "To run the frontend (in a separate terminal):"
echo "  npm run dev"
