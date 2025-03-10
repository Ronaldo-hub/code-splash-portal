import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Algorand configuration
ALGORAND_ALGOD_ADDRESS = os.getenv("ALGORAND_ALGOD_ADDRESS", "https://testnet-api.algonode.cloud")
ALGORAND_ALGOD_TOKEN = os.getenv("ALGORAND_ALGOD_TOKEN", "")
ALGORAND_INDEXER_ADDRESS = os.getenv("ALGORAND_INDEXER_ADDRESS", "https://testnet-idx.algonode.cloud")
ALGORAND_INDEXER_TOKEN = os.getenv("ALGORAND_INDEXER_TOKEN", "")

# Quantum security parameters
QUANTUM_KEY_SIZE = int(os.getenv("QUANTUM_KEY_SIZE", "256"))
QUANTUM_CIRCUIT_DEPTH = int(os.getenv("QUANTUM_CIRCUIT_DEPTH", "3"))

# Application settings
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

# DHA API Configuration (mock values - would be set in production)
DHA_API_KEY = os.getenv("DHA_API_KEY", "mock-api-key")
DHA_API_URL = os.getenv("DHA_API_URL", "https://api.dha.gov.za/verify")
