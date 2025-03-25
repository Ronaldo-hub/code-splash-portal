from algosdk import account, transaction
from algosdk.v2client import algod
from algosdk.mnemonic import to_private_key

# Configure Algod client
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""  # No token required for Algonode
algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

# Replace with your wallet's mnemonic
creator_mnemonic = "your 25-word mnemonic here"
creator_private_key = to_private_key(creator_mnemonic)
creator_address = account.address_from_private_key(creator_private_key)


def create_asa():
    try:
        # Get suggested transaction parameters
        params = algod_client.suggested_params()

        # Define ASA parameters
        txn = transaction.AssetConfigTxn(
            sender=creator_address,
            sp=params,
            total=1000000,  # Total supply: 1,000,000 tokens
            decimals=0,  # No decimals
            default_frozen=False,  # Tokens are not frozen by default
            unit_name="MYTOKEN",  # Short name
            asset_name="My Test Token",  # Full name
            manager=creator_address,  # Address to manage the ASA
            reserve=creator_address,  # Reserve address
            freeze=creator_address,  # Freeze address
            clawback=creator_address,  # Clawback address
        )

        # Sign the transaction
        signed_txn = txn.sign(creator_private_key)

        # Submit the transaction
        txid = algod_client.send_transaction(signed_txn)
        print(f"Transaction ID: {txid}")

        # Wait for confirmation
        confirmed_txn = transaction.wait_for_confirmation(
            algod_client, txid, 4)
        print(f"ASA created with ID: {confirmed_txn['asset-index']}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    create_asa()
