from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from urllib.parse import quote  # Replace Werkzeug's url_quote with this
from algosdk.v2client import indexer
import os
import requests

# Import custom modules
from voting import register_voter, create_election, add_proposal, cast_vote, submit_offline_vote, get_election_results
from smart_id import SmartIDVerification
from baidu_ernie import ErnieX1
from config import ERNIE_API_KEY  # Import API key from config

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the Indexer client
INDEXER_ADDRESS = "https://testnet-idx.algonode.cloud"
INDEXER_TOKEN = ""  # No token required for Algonode
indexer_client = indexer.IndexerClient(INDEXER_TOKEN, INDEXER_ADDRESS)

# Flask routes


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    voter_id = data.get('voter_id')

    if not voter_id:
        return jsonify({"error": "voter_id is required"}), 400

    try:
        # Attempt to register voter with verification
        result = register_voter(voter_id)
        return jsonify(result)
    except ValueError as e:
        # Handle verification/eligibility errors
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        # Handle other errors
        return jsonify({"error": str(e)}), 500


@app.route('/create-election', methods=['POST'])
def create_election_route():
    data = request.json

    # Extract and validate data
    creator_credentials = data.get('creator_credentials')
    election_name = data.get('election_name')
    total_votes = data.get('total_votes')
    multisig_admin = data.get('multisig_admin')

    if not creator_credentials or not election_name or not total_votes:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Call actual implementation
        result = create_election(
            creator_credentials, election_name, total_votes, multisig_admin)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/add-proposal', methods=['POST'])
def add_proposal_route():
    data = request.json

    # Extract and validate data
    asset_id = data.get('asset_id')
    proposal_name = data.get('proposal_name')
    proposal_details = data.get('proposal_details')

    if not asset_id or not proposal_name:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Call actual implementation
        result = add_proposal(asset_id, proposal_name, proposal_details)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/cast-vote', methods=['POST'])
def cast_vote_route():
    data = request.json

    # Extract and validate data
    voter_credentials = data.get('voter_credentials')
    asset_id = data.get('asset_id')
    voting_power = data.get('voting_power')
    proposal_name = data.get('proposal_name')

    if not voter_credentials or not asset_id or not voting_power or not proposal_name:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Verify the voter's ASA balance
        # Replace with actual logic to get the voter's address
        voter_address = voter_credentials
        asa_id = 123456  # Replace with your ASA ID
        account_info = indexer_client.account_info(voter_address)
        assets = account_info.get('account', {}).get('assets', [])
        voter_balance = next((a['amount']
                             for a in assets if a['asset-id'] == asa_id), 0)

        if voter_balance < voting_power:
            return jsonify({"error": "Insufficient token balance to vote"}), 403

        # Call actual implementation
        result = cast_vote(voter_credentials, asset_id,
                           voting_power, proposal_name)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/offline-vote', methods=['POST'])
def offline_vote_route():
    data = request.json

    # Extract and validate data
    voter_id = data.get('voter_id')
    vote_data = data.get('vote_data')

    if not voter_id or not vote_data:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Call actual implementation
        result = submit_offline_vote(voter_id, vote_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/verify-smart-id', methods=['POST'])
def verify_smart_id():
    data = request.json
    voter_id = data.get('voter_id')
    smart_id = data.get('smart_id')

    if not voter_id or not smart_id:
        return jsonify({"error": "voter_id and smart_id are required"}), 400

    try:
        # Attempt to verify Smart ID
        verifier = ErnieX1(api_key=ERNIE_API_KEY)
        result = verifier.verify(voter_id, smart_id)
        return jsonify(result)
    except ValueError as e:
        # Handle verification errors
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        # Handle other errors
        return jsonify({"error": str(e)}), 500


@app.route('/results', methods=['GET'])
def results():
    try:
        # Call actual implementation
        result = get_election_results()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_ai_response(user_input):
    """
    Sends a user input to the Deepseek model via OpenRouter API and returns the model's reply.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError(
            "OPENROUTER_API_KEY is not set in the environment variables.")

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "user", "content": user_input}
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("choices", [{}])[0].get("message", {}).get("content", "")
    except requests.exceptions.RequestException as e:
        # Log or handle the error as needed
        raise RuntimeError(f"Failed to get response from OpenRouter API: {e}")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
