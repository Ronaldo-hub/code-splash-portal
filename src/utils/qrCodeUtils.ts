
import { Voter } from "@/contexts/VotingSystemContext";

/**
 * Encodes voter information into a QR code format
 * @param voter The voter object to encode
 * @returns Encoded string for QR code
 */
export const encodeVoterForQR = (voter: Voter): string => {
  // Create encoded data with just enough info to identify the voter
  // but without sensitive information
  const qrData = {
    id: voter.voterId,
    addr: voter.algoAddress.slice(0, 8) + '...' + voter.algoAddress.slice(-8),
    ts: new Date().toISOString(),
    v: 1, // version for future compatibility
  };
  
  return JSON.stringify(qrData);
};

/**
 * Validates a QR code string against a voter database
 * @param qrString The string from the scanned QR code
 * @param voters Array of registered voters to check against
 * @returns The matched voter or null if no match found
 */
export const validateVoterQR = (
  qrString: string, 
  voters: Voter[]
): Voter | null => {
  try {
    // Parse the QR data
    const qrData = JSON.parse(qrString);
    
    // Find the voter with matching ID
    const matchedVoter = voters.find(voter => 
      voter.voterId === qrData.id
    );
    
    if (!matchedVoter) {
      console.error("No voter found with ID:", qrData.id);
      return null;
    }
    
    // Extra validation could be added here
    // For example, checking if the address prefix/suffix matches
    
    return matchedVoter;
  } catch (error) {
    console.error("Failed to validate QR code:", error);
    return null;
  }
};

/**
 * Generates a unique secure token for a voter session
 * @param voter The voter to generate a token for
 * @returns A session token string
 */
export const generateVoterSessionToken = (voter: Voter): string => {
  // In a real implementation, this would use a cryptographically secure
  // random generator and possibly include signature validation
  const tokenData = {
    id: voter.voterId,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(2, 15)
  };
  
  return btoa(JSON.stringify(tokenData));
};
