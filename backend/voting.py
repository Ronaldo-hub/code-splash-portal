
from quantum import generate_quantum_keypair, encrypt_vote, decrypt_vote, generate_vote_hash
from blockchain import create_account, create_voting_asset, transfer_votes, submit_vote_to_blockchain, get_voting_results

# Store active elections (in a real system, this would be in a database)
active_elections = {}
# Store registered voters (in a real system, this would be in a database)
registered_voters = {}
# Store vote batches (in a real system, this would be in a database)
vote_batches = {}

def register_voter(voter_id):
    """
    Register a new voter with quantum-resistant keys and Algorand account.
    
    Args:
        voter_id: Unique identifier for the voter
        
    Returns:
        Voter credentials
    """
    # Check if voter is already registered
    if voter_id in registered_voters:
        return registered_voters[voter_id]
    
    # Create Algorand account
    algo_account = create_account()
    
    # Generate quantum-resistant keypair
    quantum_keys = generate_quantum_keypair()
    
    # Create voter record
    voter = {
        "voterId": voter_id,
        "algoAddress": algo_account["address"],
        "algoMnemonic": algo_account["mnemonic"],
        "pqPublicKey": quantum_keys["public_key"],
        "pqPrivateKey": quantum_keys["private_key"]
    }
    
    # Save voter
    registered_voters[voter_id] = voter
    
    return voter

def create_election(creator_credentials, election_name, total_votes, multisig_admin=None):
    """
    Create a new election on the blockchain.
    
    Args:
        creator_credentials: Credentials of the election creator
        election_name: Name of the election
        total_votes: Total number of votes to create
        multisig_admin: Optional multisig admin information
        
    Returns:
        Election details
    """
    # Create the voting asset on Algorand
    creator_mnemonic = creator_credentials.get("algoMnemonic")
    if not creator_mnemonic:
        raise ValueError("Creator mnemonic is required")
    
    # Create the asset
    asset_id = create_voting_asset(creator_mnemonic, election_name, total_votes)
    
    # Store election data
    election = {
        "assetId": asset_id,
        "electionName": election_name,
        "totalVotes": total_votes,
        "creator": creator_credentials.get("voterId"),
        "multisigAdmin": multisig_admin,
        "proposals": {}  # Will store proposal addresses and their metadata
    }
    
    active_elections[asset_id] = election
    
    return election

def add_proposal(asset_id, proposal_name, proposal_details):
    """
    Add a proposal to an election.
    
    Args:
        asset_id: ID of the election asset
        proposal_name: Name of the proposal
        proposal_details: Additional details about the proposal
        
    Returns:
        Proposal information
    """
    if asset_id not in active_elections:
        raise ValueError("Election not found")
    
    # Create a new Algorand account for the proposal
    proposal_account = create_account()
    
    # Add proposal to election
    proposal = {
        "name": proposal_name,
        "details": proposal_details,
        "address": proposal_account["address"],
        "mnemonic": proposal_account["mnemonic"]
    }
    
    active_elections[asset_id]["proposals"][proposal_name] = proposal
    
    return proposal

def cast_vote(voter_credentials, asset_id, voting_power, proposal_name):
    """
    Cast a vote in an election.
    
    Args:
        voter_credentials: Credentials of the voter
        asset_id: ID of the election asset
        voting_power: Number of votes to cast
        proposal_name: Name of the proposal to vote for
        
    Returns:
        Vote transaction details
    """
    if asset_id not in active_elections:
        raise ValueError("Election not found")
    
    election = active_elections[asset_id]
    if proposal_name not in election["proposals"]:
        raise ValueError("Proposal not found")
    
    proposal = election["proposals"][proposal_name]
    voter_mnemonic = voter_credentials.get("algoMnemonic")
    
    if not voter_mnemonic:
        raise ValueError("Voter mnemonic is required")
    
    # Create vote data
    vote_data = {
        "voter": voter_credentials.get("voterId"),
        "election": asset_id,
        "proposal": proposal_name,
        "voting_power": voting_power,
        "timestamp": int(time.time())
    }
    
    # Generate hash of vote for verification
    vote_hash = generate_vote_hash(vote_data)
    
    # Submit vote to blockchain
    txid = submit_vote_to_blockchain(
        voter_mnemonic,
        proposal["address"],
        asset_id,
        voting_power,
        vote_hash
    )
    
    # Create a batch record for this vote
    batch_id = f"batch_{txid}"
    vote_batches[batch_id] = {
        "txid": txid,
        "vote_data": vote_data,
        "vote_hash": vote_hash
    }
    
    return {
        "batchId": batch_id,
        "txid": txid,
        "vote_hash": vote_hash
    }

def submit_offline_vote(voter_id, vote_data):
    """
    Submit a vote that was created offline.
    
    Args:
        voter_id: ID of the voter
        vote_data: Encrypted vote data
        
    Returns:
        Vote record
    """
    # In a real system, this would verify the vote data and submit it to the blockchain
    
    # Generate a hash of the vote data
    vote_hash = generate_vote_hash(vote_data)
    
    # Create a batch ID
    batch_id = f"offline_batch_{hash(voter_id) % 10000}"
    
    # Store the vote
    vote_batches[batch_id] = {
        "voter_id": voter_id,
        "vote_data": vote_data,
        "vote_hash": vote_hash
    }
    
    return {
        "voteHash": vote_hash,
        "batchId": batch_id
    }

def get_election_results():
    """
    Get results for all active elections.
    
    Returns:
        List of election results
    """
    results = []
    
    for asset_id, election in active_elections.items():
        # Get proposal addresses
        proposal_addresses = {
            proposal["name"]: proposal["address"] 
            for proposal_name, proposal in election["proposals"].items()
        }
        
        # Get voting results from blockchain
        blockchain_results = get_voting_results(asset_id, list(proposal_addresses.values()))
        
        # Format results
        proposals_results = [
            {
                "name": name,
                "votes": blockchain_results.get(address, 0)
            }
            for name, address in proposal_addresses.items()
        ]
        
        election_result = {
            "id": asset_id,
            "name": election["electionName"],
            "proposals": proposals_results
        }
        
        results.append(election_result)
    
    return results
