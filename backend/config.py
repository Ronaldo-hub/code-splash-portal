import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from algosdk import account, transaction
from algosdk.v2client import algod
from algosdk.mnemonic import to_private_key

# Load environment variables from .env file if it exists
load_dotenv()

# Algorand TestNet configuration
ALGORAND_ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGORAND_ALGOD_TOKEN = ""  # No token needed for AlgoNode
ALGORAND_INDEXER_ADDRESS = "https://testnet-idx.algonode.cloud"
ALGORAND_INDEXER_TOKEN = ""  # No token needed for AlgoNode

# Initialize the TestNet client
algod_client = algod.AlgodClient(ALGORAND_ALGOD_TOKEN, ALGORAND_ALGOD_ADDRESS)

def create_test_account():
    """Creates a new TestNet account"""
    private_key, address = account.generate_account()
    return {
        "address": address,
        "private_key": private_key,
        "mnemonic": account.mnemonic.from_private_key(private_key)
    }

def fund_test_wallet(voter_wallet_address):
    """
    Sends test tokens to the voter's wallet.
    In production, this would validate and process actual token transfers.
    """
    try:
        # For TestNet, first make sure you have funded the treasury account
        # using the Algorand TestNet Dispenser
        if not os.getenv("TREASURY_MNEMONIC"):
            return {
                "success": False,
                "error": "Treasury account not configured. Please add TREASURY_MNEMONIC to .env"
            }

        # Get the treasury account
        treasury_private_key = to_private_key(os.getenv("TREASURY_MNEMONIC"))
        treasury_address = account.address_from_private_key(treasury_private_key)

        # Get suggested parameters
        params = algod_client.suggested_params()
        
        # Create a payment transaction
        txn = transaction.PaymentTxn(
            sender=treasury_address,
            sp=params,
            receiver=voter_wallet_address,
            amt=1000000  # 1 Algo = 1000000 microAlgos
        )
        
        # Sign the transaction
        signed_txn = txn.sign(treasury_private_key)
        
        # Submit the transaction
        txid = algod_client.send_transaction(signed_txn)
        
        # Wait for confirmation
        transaction.wait_for_confirmation(algod_client, txid, 4)
        
        return {"success": True, "txid": txid}
    except Exception as e:
        return {"success": False, "error": str(e)}

# Quantum security parameters
QUANTUM_KEY_SIZE = int(os.getenv("QUANTUM_KEY_SIZE", "256"))
QUANTUM_CIRCUIT_DEPTH = int(os.getenv("QUANTUM_CIRCUIT_DEPTH", "3"))

# Application settings
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

# DHA API Configuration (mock values - would be set in production)
DHA_API_KEY = os.getenv("DHA_API_KEY", "mock-api-key")
DHA_API_URL = os.getenv("DHA_API_URL", "https://api.dha.gov.za/verify")

# Configuration file for API keys

# Baidu Ernie X1 API key
ERNIE_API_KEY = 'your_api_key_here'

# Add other API keys here as needed

# Pera Wallet configuration
PERA_WALLET_ADDRESS = os.getenv(
    "PERA_WALLET_ADDRESS", "Wallet Address"
PERA_WALLET_MNEMONIC = os.getenv(
    "PERA_WALLET_MNEMONIC", "mnemonic")

# Registered wallet for the specific cause
REGISTERED_CAUSE_WALLET_ADDRESS = "YOUR_REGISTERED_CAUSE_WALLET_ADDRESS"
REGISTERED_CAUSE_WALLET_MNEMONIC = "YOUR_REGISTERED_CAUSE_WALLET_MNEMONIC"

# Algorand client setup
algod_client = algod.AlgodClient(ALGORAND_ALGOD_TOKEN, ALGORAND_ALGOD_ADDRESS)


def get_voter_address():
    """
    Returns the Pera Wallet address for voters to use.
    """
    return PERA_WALLET_ADDRESS


def fund_voter_wallet(voter_wallet_address):
    """
    Sends a small amount of the specialized token (ASA) to the voter's wallet.
    """
    try:
        # Convert mnemonic to private key
        private_key = to_private_key(REGISTERED_CAUSE_WALLET_MNEMONIC)
        # Get suggested transaction parameters
        params = algod_client.suggested_params()
        # Define the ASA ID (replace with your ASA ID)
        asa_id = 123456  # Replace with the actual ASA ID
        # Create an asset transfer transaction
        txn = transaction.AssetTransferTxn(
            sender=REGISTERED_CAUSE_WALLET_ADDRESS,
            receiver=voter_wallet_address,
            amt=10,  # Amount of the token to send
            index=asa_id,  # ASA ID
            sp=params
        )
        # Sign the transaction
        signed_txn = txn.sign(private_key)
        # Submit the transaction
        txid = algod_client.send_transaction(signed_txn)
        return {"success": True, "txid": txid}
    except Exception as e:
        return {"success": False, "error": str(e)}


app = Flask(__name__)


@app.route('/api/status', methods=['GET'])
def api_status():
    """
    Endpoint to confirm the backend is connected.
    """
    return jsonify({"status": "Backend is connected", "wallet_address": get_voter_address()})


@app.route('/api/fund-voter/<voter_wallet>', methods=['POST'])
def fund_voter(voter_wallet):
    """
    API endpoint to fund a voter's wallet.
    """
    result = fund_voter_wallet(voter_wallet)
    return jsonify(result)


@app.route('/api/vote-count', methods=['GET'])
def get_vote_count():
    """
    API endpoint to retrieve the number of votes recorded.
    """
    try:
        # Replace this with actual logic to fetch vote count
        # For demonstration, we'll assume votes are stored in a database or smart contract
        # Example: Fetch vote count from the blockchain or database
        vote_count = 42  # Replace with actual logic to fetch vote count
        return jsonify({"success": True, "vote_count": vote_count})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


# Run the Flask app to test the endpoint
if __name__ == "__main__":
    app.run(debug=True)
