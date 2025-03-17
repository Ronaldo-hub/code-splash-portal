
#!/bin/bash
set -e

echo "Setting up development environment..."

# Set up backend
cd /workspaces/$(basename $(pwd))/backend
python -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

# Set up frontend
cd /workspaces/$(basename $(pwd))
npm install

echo "Setup completed successfully!"
echo "To run the backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "To run the frontend (in a separate terminal):"
echo "  npm run dev"
