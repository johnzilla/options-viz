import { useState, useEffect } from 'react';
import { OptionContract } from '../types/options';
import { polygonApi } from '../services/polygonApi';

interface UseOptionsDataReturn {
  data: OptionContract[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useOptionsData = (ticker: string = 'AAPL'): UseOptionsDataReturn => {
  const [data, setData] = useState<OptionContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await polygonApi.getOptionsChain(ticker);
      
      if (response.results) {
        // Filter and process the data for better visualization
        const processedData = response.results
          .filter(contract => 
            contract.strike_price > 0 && // Valid strike prices
            contract.expiration_date && // Valid expiration date
            (contract.contract_type === 'call' || contract.contract_type === 'put') // Valid contract type
          )
          .map(contract => ({
            ...contract,
            open_interest: contract.open_interest || 0 // Default open interest if missing
          }));
        
        setData(processedData);
      } else {
        setData([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch options data';
      setError(errorMessage);
      console.error('Error fetching options data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ticker]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};