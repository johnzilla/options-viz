import { useState, useEffect, useRef } from 'react';
import { OptionContract } from '../types/options';
import { polygonApi } from '../services/polygonApi';

interface UseOptionsDataReturn {
  data: OptionContract[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  debugInfo: any;
}

export const useOptionsData = (ticker: string = 'AAPL'): UseOptionsDataReturn => {
  const [data, setData] = useState<OptionContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const hasFetched = useRef(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching options data for ticker:', ticker);
      const response = await polygonApi.getOptionsChain(ticker);
      
      console.log('Raw API response:', response);
      setDebugInfo({
        status: response.status,
        count: response.count,
        resultsLength: response.results?.length || 0,
        hasResults: !!response.results,
        firstFewResults: response.results?.slice(0, 3)
      });
      
      if (response.results && response.results.length > 0) {
        // Process the data with minimal filtering for now
        const processedData = response.results
          .filter(contract => {
            // Basic validation - just ensure we have required fields
            const hasValidStrike = typeof contract.strike_price === 'number' && contract.strike_price > 0;
            const hasValidExpiration = contract.expiration_date && contract.expiration_date.length > 0;
            const hasValidType = contract.contract_type === 'call' || contract.contract_type === 'put';
            
            return hasValidStrike && hasValidExpiration && hasValidType;
          })
          .map(contract => ({
            ...contract,
            // Ensure open_interest has a default value if missing
            open_interest: contract.open_interest || 100 // Fixed size for now as requested
          }));
        
        console.log('Processed data length:', processedData.length);
        console.log('Sample processed contracts:', processedData.slice(0, 5));
        
        setData(processedData);
      } else {
        console.log('No results in API response');
        setData([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch options data';
      console.error('Error in useOptionsData:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent duplicate API calls in React StrictMode (development)
    if (hasFetched.current) {
      return;
    }
    
    hasFetched.current = true;
    fetchData();
  }, [ticker]);

  const refetch = () => {
    // Reset the ref when manually refetching
    hasFetched.current = false;
    fetchData();
  };

  return { data, loading, error, refetch, debugInfo };
};