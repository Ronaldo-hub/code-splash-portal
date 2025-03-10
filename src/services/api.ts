
import axios from 'axios';

// Get the API base URL from environment variable or use a default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints for the voting system
export const votingAPI = {
  // Voter registration
  registerVoter: async (voterId: string) => {
    const response = await api.post('/register', { voter_id: voterId });
    return response.data;
  },

  // Create election
  createElection: async (creatorCredentials: any, electionName: string, totalVotes: number, multisigAdmin: any) => {
    const response = await api.post('/create-election', {
      creator_credentials: creatorCredentials,
      election_name: electionName,
      total_votes: totalVotes,
      multisig_admin: multisigAdmin,
    });
    return response.data;
  },

  // Cast vote
  castVote: async (voterCredentials: any, assetId: number, votingPower: number, proposalAddress: string) => {
    const response = await api.post('/cast-vote', {
      voter_credentials: voterCredentials,
      asset_id: assetId,
      voting_power: votingPower,
      proposal_address: proposalAddress,
    });
    return response.data;
  },

  // Submit offline vote
  submitOfflineVote: async (voterId: string, voteData: any) => {
    const response = await api.post('/offline-vote', {
      voter_id: voterId,
      vote_data: voteData,
    });
    return response.data;
  },

  // Get election results
  getResults: async () => {
    const response = await api.get('/results');
    return response.data;
  },
};

export default api;
