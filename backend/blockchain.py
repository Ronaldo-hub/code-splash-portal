
from algosdk import account, mnemonic
from algosdk.v2client import algod, indexer
from algosdk.future.transaction import AssetConfigTxn, AssetTransferTxn
from algosdk.future.transaction import PaymentTxn, wait_for_confirmation
import json
import time
import base64
from config import ALGORAND_ALGOD_ADDRESS, ALGORAND_ALGOD_TOKEN

# Initialize Algorand client
def get_algod_client():
    """Get Algorand client for interacting with the blockchain."""
    return algod.AlgodClient(ALGORAND_ALGOD_TOKEN, ALGORAND_ALGOD_ADDRESS)

def create_account():
    """Create a new Algorand account."""
    private_key, address = account.generate_account()
    account_mnemonic = mnemonic.from_private_key(private_key)
    return {
        "address": address,
        "private_key": private_key,
        "mnemonic": account_mnemonic
    }

def create_voting_asset(creator_mnemonic, asset_name, total_votes):
    """
    Create a new Algorand asset to represent votes in an election.
    
    Args:
        creator_mnemonic: Mnemonic of the creator account
        asset_name: Name of the election/voting asset
        total_votes: Total number of votes to create
        
    Returns:
        Asset ID of the created voting token
    """
    # Get the private key from mnemonic
    private_key = mnemonic.to_private_key(creator_mnemonic)
    
    # Get creator address
    sender = account.address_from_private_key(private_key)
    
    # Get algod client
    algod_client = get_algod_client()
    
    # Get suggested parameters
    params = algod_client.suggested_params()
    
    # Create the asset creation transaction
    txn = AssetConfigTxn(
        sender=sender,
        sp=params,
        total=total_votes,
        default_frozen=False,
        unit_name="VOTE",
        asset_name=asset_name,
        manager=sender,
        reserve=sender,
        freeze=sender,
        clawback=sender,
        url="",
        decimals=0
    )
    
    # Sign the transaction
    signed_txn = txn.sign(private_key)
    
    # Send the transaction
    txid = algod_client.send_transaction(signed_txn)
    
    # Wait for confirmation
    wait_for_confirmation(algod_client, txid)
    
    # Get the asset ID
    ptx = algod_client.pending_transaction_info(txid)
    asset_id = ptx["asset-index"]
    
    return asset_id

def transfer_votes(sender_mnemonic, receiver_address, asset_id, amount):
    """
    Transfer voting tokens to a voter.
    
    Args:
        sender_mnemonic: Mnemonic of the sender account
        receiver_address: Address of the receiver
        asset_id: ID of the voting asset
        amount: Number of votes to transfer
        
    Returns:
        Transaction ID
    """
    # Get the private key from mnemonic
    private_key = mnemonic.to_private_key(sender_mnemonic)
    
    # Get sender address
    sender = account.address_from_private_key(private_key)
    
    # Get algod client
    algod_client = get_algod_client()
    
    # Get suggested parameters
    params = algod_client.suggested_params()
    
    # Create the asset transfer transaction
    txn = AssetTransferTxn(
        sender=sender,
        sp=params,
        receiver=receiver_address,
        amt=amount,
        index=asset_id
    )
    
    # Sign the transaction
    signed_txn = txn.sign(private_key)
    
    # Send the transaction
    txid = algod_client.send_transaction(signed_txn)
    
    # Wait for confirmation
    wait_for_confirmation(algod_client, txid)
    
    return txid

def submit_vote_to_blockchain(voter_mnemonic, proposal_address, asset_id, voting_power, vote_hash):
    """
    Submit a vote to the blockchain.
    
    Args:
        voter_mnemonic: Mnemonic of the voter
        proposal_address: Address of the proposal
        asset_id: ID of the voting asset
        voting_power: Number of votes to cast
        vote_hash: Hash of the vote data for verification
        
    Returns:
        Transaction ID
    """
    # Get the private key from mnemonic
    private_key = mnemonic.to_private_key(voter_mnemonic)
    
    # Get voter address
    sender = account.address_from_private_key(private_key)
    
    # Get algod client
    algod_client = get_algod_client()
    
    # Get suggested parameters
    params = algod_client.suggested_params()
    
    # Create the asset transfer transaction
    txn = AssetTransferTxn(
        sender=sender,
        sp=params,
        receiver=proposal_address,
        amt=voting_power,
        index=asset_id,
        note=vote_hash.encode()
    )
    
    # Sign the transaction
    signed_txn = txn.sign(private_key)
    
    # Send the transaction
    txid = algod_client.send_transaction(signed_txn)
    
    # Wait for confirmation
    wait_for_confirmation(algod_client, txid)
    
    return txid

def get_voting_results(asset_id, proposals):
    """
    Get the voting results for a specific election.
    
    Args:
        asset_id: ID of the voting asset
        proposals: List of proposal addresses to check
        
    Returns:
        Dictionary with proposal addresses as keys and vote counts as values
    """
    # Get algod client
    algod_client = get_algod_client()
    
    # Initialize results
    results = {}
    
    # Check balance for each proposal
    for proposal in proposals:
        account_info = algod_client.account_info(proposal)
        
        # Find the asset holding for the voting asset
        vote_count = 0
        for asset in account_info.get('assets', []):
            if asset['asset-id'] == asset_id:
                vote_count = asset['amount']
                break
        
        results[proposal] = vote_count
    
    return results
