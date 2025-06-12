export interface OptionContract {
  underlying_ticker: string;
  contract_type: 'call' | 'put';
  expiration_date: string;
  strike_price: number;
  open_interest: number;
  implied_volatility?: number;
  gamma?: number;
  delta?: number;
  theta?: number;
  vega?: number;
  ticker: string;
}

export interface OptionsChainResponse {
  status: string;
  results?: OptionContract[];
  count?: number;
  next_url?: string;
}