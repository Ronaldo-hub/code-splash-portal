import React, { createContext, useContext, useState, ReactNode } from "react";

export type Voter = {
  voterId: string;
  algoAddress: string;
  algoMnemonic: string;
  pqPublicKey?: string;
  pqPrivateKey?: string;
  walletBalance?: number; // Add wallet balance field
};

type Election = {
  assetId: number;
  electionName: string;
  totalVotes: number;
};

type Vote = {
  voterId: string;
  assetId: number;
  votingPower: number;
  proposalAddress: string;
  batchId?: string;
};

type OfflineVote = {
  voterId: string;
  voteData: Record<string, any>;
  voteHash?: string;
  batchId?: string;
};

interface VotingSystemContextType {
  currentVoter: Voter | null;
  registeredVoters: Voter[];
  elections: Election[];
  votes: Vote[];
  offlineVotes: OfflineVote[];
  loading: boolean;
  error: string | null;
  registerVoter: (voterId: string) => Promise<Voter>;
  createElection: (electionData: Omit<Election, "assetId">) => Promise<Election>;
  castVote: (voteData: Omit<Vote, "batchId">) => Promise<string>;
  submitOfflineVote: (offlineVoteData: Omit<OfflineVote, "voteHash" | "batchId">) => Promise<{ voteHash: string; batchId: string }>;
  setCurrentVoter: (voter: Voter | null) => void;
  clearError: () => void;
  // New wallet functions
  addFunds: (amount: number) => Promise<void>;
  getWalletBalance: () => number;
}

const VotingSystemContext = createContext<VotingSystemContextType | undefined>(undefined);

export const VotingSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null);
  const [registeredVoters, setRegisteredVoters] = useState<Voter[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [offlineVotes, setOfflineVotes] = useState<OfflineVote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registerVoter = async (voterId: string): Promise<Voter> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newVoter: Voter = {
        voterId,
        algoAddress: `ALGO${Math.random().toString(36).substring(2, 15)}`,
        algoMnemonic: `word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12`,
        pqPublicKey: `pq_pub_${Math.random().toString(36).substring(2, 15)}`,
        pqPrivateKey: `pq_priv_${Math.random().toString(36).substring(2, 15)}`,
      };
      
      setRegisteredVoters(prev => [...prev, newVoter]);
      setCurrentVoter(newVoter);
      
      return newVoter;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register voter");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createElection = async (electionData: Omit<Election, "assetId">): Promise<Election> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newElection: Election = {
        ...electionData,
        assetId: Math.floor(Math.random() * 1000000),
      };
      
      setElections(prev => [...prev, newElection]);
      
      return newElection;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create election");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (voteData: Omit<Vote, "batchId">): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const batchId = `batch_${Math.random().toString(36).substring(2, 15)}`;
      
      const newVote: Vote = {
        ...voteData,
        batchId,
      };
      
      setVotes(prev => [...prev, newVote]);
      
      return batchId;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cast vote");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitOfflineVote = async (
    offlineVoteData: Omit<OfflineVote, "voteHash" | "batchId">
  ): Promise<{ voteHash: string; batchId: string }> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const voteHash = `hash_${Math.random().toString(36).substring(2, 15)}`;
      const batchId = `offline_batch_${Math.random().toString(36).substring(2, 15)}`;
      
      const newOfflineVote: OfflineVote = {
        ...offlineVoteData,
        voteHash,
        batchId,
      };
      
      setOfflineVotes(prev => [...prev, newOfflineVote]);
      
      return { voteHash, batchId };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit offline vote");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // New function to add funds to the current voter's wallet
  const addFunds = async (amount: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!currentVoter) {
        throw new Error("No voter is currently logged in");
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the current voter's wallet balance
      const updatedVoter = {
        ...currentVoter,
        walletBalance: (currentVoter.walletBalance || 0) + amount
      };
      
      // Update current voter
      setCurrentVoter(updatedVoter);
      
      // Update in registered voters list as well
      setRegisteredVoters(prev => 
        prev.map(voter => 
          voter.voterId === updatedVoter.voterId ? updatedVoter : voter
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add funds");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to get current wallet balance
  const getWalletBalance = (): number => {
    return currentVoter?.walletBalance || 0;
  };

  const value = {
    currentVoter,
    registeredVoters,
    elections,
    votes,
    offlineVotes,
    loading,
    error,
    registerVoter,
    createElection,
    castVote,
    submitOfflineVote,
    setCurrentVoter,
    clearError,
    // Add new wallet functions
    addFunds,
    getWalletBalance,
  };

  return (
    <VotingSystemContext.Provider value={value}>
      {children}
    </VotingSystemContext.Provider>
  );
};

export const useVotingSystem = (): VotingSystemContextType => {
  const context = useContext(VotingSystemContext);
  if (context === undefined) {
    throw new Error("useVotingSystem must be used within a VotingSystemProvider");
  }
  return context;
};
