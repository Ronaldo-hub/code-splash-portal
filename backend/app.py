from flask import Flask, request, jsonify
from flask_cors import CORS
import time

# Import custom modules
from voting import register_voter, create_election, add_proposal, cast_vote, submit_offline_vote, get_election_results
from smart_id import SmartIDVerification

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        result = create_election(creator_credentials, election_name, total_votes, multisig_admin)
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
        # Call actual implementation
        result = cast_vote(voter_credentials, asset_id, voting_power, proposal_name)
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

@app.route('/results', methods=['GET'])
def results():
    try:
        # Call actual implementation
        result = get_election_results()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
