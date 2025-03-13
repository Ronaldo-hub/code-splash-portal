
import { useState } from 'react';
import { toast } from 'sonner';
import { votingAPI } from '../services/api';

// This is a convenience hook that handles API calls with loading and error states
export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to determine if we should use mock data or real API
  // You can control this with an environment variable
  const useMockData = () => {
    return import.meta.env.VITE_USE_MOCK_DATA === 'true';
  };

  // Generic API call function with error handling
  const callAPI = async <T>(
    apiFunction: () => Promise<T>,
    mockData: T,
    errorMessage: string
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      // If we're using mock data, simulate an API call with a delay
      if (useMockData()) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return mockData;
      }
      
      // Otherwise, make the real API call
      const result = await apiFunction();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      setError(message);
      toast.error(errorMessage);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration purposes
  const getMockElectionResults = () => {
    return {
      elections: [
        {
          id: 1001,
          name: "National Healthcare Initiative",
          date: "2023-11-15",
          totalVoters: 1250,
          turnout: 78.4,
          proposals: [
            { name: "Proposal A: Expand Coverage", votes: 534, percentage: 54.7 },
            { name: "Proposal B: Reform Current System", votes: 312, percentage: 32.0 },
            { name: "Proposal C: No Change", votes: 130, percentage: 13.3 }
          ]
        },
        {
          id: 1002,
          name: "Urban Development Project",
          date: "2023-12-05",
          totalVoters: 856,
          turnout: 65.2,
          proposals: [
            { name: "Plan 1: Green Spaces", votes: 286, percentage: 51.3 },
            { name: "Plan 2: Commercial District", votes: 198, percentage: 35.5 },
            { name: "Plan 3: Mixed Use", votes: 74, percentage: 13.2 }
          ]
        },
        {
          id: 1003,
          name: "Educational Funding Allocation",
          date: "2024-01-20",
          totalVoters: 2100,
          turnout: 82.1,
          proposals: [
            { name: "Option A: STEM Focus", votes: 843, percentage: 48.9 },
            { name: "Option B: Arts & Humanities", votes: 512, percentage: 29.7 },
            { name: "Option C: Equal Distribution", votes: 369, percentage: 21.4 }
          ]
        }
      ]
    };
  };

  // Function to get election results
  const getElectionResults = async () => {
    return callAPI(
      votingAPI.getResults,
      getMockElectionResults(),
      "Failed to fetch election results"
    );
  };

  return {
    loading,
    error,
    callAPI,
    clearError: () => setError(null),
    votingAPI,
    getElectionResults
  };
}
