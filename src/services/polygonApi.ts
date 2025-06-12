import { OptionsChainResponse } from '../types/options';

const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

export class PolygonApiService {
  private static instance: PolygonApiService;

  private constructor() {}

  static getInstance(): PolygonApiService {
    if (!PolygonApiService.instance) {
      PolygonApiService.instance = new PolygonApiService();
    }
    return PolygonApiService.instance;
  }

  async getOptionsChain(
    underlyingTicker: string = 'AAPL',
    expirationDate?: string
  ): Promise<OptionsChainResponse> {
    if (!API_KEY || API_KEY === 'your_polygon_api_key_here') {
      throw new Error('Please set your Polygon.io API key in the .env file');
    }

    try {
      const params = new URLSearchParams({
        'underlying_ticker': underlyingTicker,
        'apikey': API_KEY,
        'limit': '50'
      });

      if (expirationDate) {
        params.append('expiration_date', expirationDate);
      }

      const response = await fetch(
        `${BASE_URL}/v3/reference/options/contracts?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OptionsChainResponse = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`API error: ${data.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching options chain:', error);
      throw error;
    }
  }

  // Future enhancement: Add method to fetch options market data with Greeks
  async getOptionMarketData(optionTicker: string) {
    // TODO: Implement market data fetching for gamma exposure and implied volatility
    // This would use the /v2/aggs/ticker/{optionsTicker}/prev endpoint
    // Combined with /v3/reference/options/contracts/{optionsTicker} for Greeks
    throw new Error('Not implemented yet - future enhancement for gamma/IV overlays');
  }
}

export const polygonApi = PolygonApiService.getInstance();