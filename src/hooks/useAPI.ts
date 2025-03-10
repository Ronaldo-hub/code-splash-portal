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

  return {
    loading,
    error,
    callAPI,
    clearError: () => setError(null),
    votingAPI,
  };
}
