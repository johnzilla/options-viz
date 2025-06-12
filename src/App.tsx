import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Info } from 'lucide-react';
import { OptionsScatterPlot } from './components/OptionsScatterPlot';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useOptionsData } from './hooks/useOptionsData';

function App() {
  const { data, loading, error, refetch } = useOptionsData('AAPL');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Responsive chart sizing
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('chart-container');
      if (container) {
        const containerWidth = container.offsetWidth;
        const width = Math.min(containerWidth - 32, 1200); // Max width with padding
        const height = Math.max(400, Math.min(width * 0.75, 700)); // Responsive height
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const callsCount = data.filter(d => d.contract_type === 'call').length;
  const putsCount = data.filter(d => d.contract_type === 'put').length;
  const totalOpenInterest = data.reduce((sum, d) => sum + d.open_interest, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Options Data Visualization
                </h1>
                <p className="text-sm text-gray-600">
                  Interactive AAPL options chain analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={refetch}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {!loading && !error && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">{data.length.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Call Options</p>
                  <p className="text-2xl font-bold text-blue-600">{callsCount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Put Options</p>
                  <p className="text-2xl font-bold text-red-500">{putsCount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-red-500 rotate-180" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Open Interest</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOpenInterest.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visualization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Options Chain Scatter Plot
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Strike price vs expiration date with open interest sizing
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Info className="w-4 h-4" />
                <span>Hover circles for details</span>
              </div>
            </div>
          </div>

          <div id="chart-container" className="p-6">
            {loading && <LoadingSpinner />}
            
            {error && (
              <ErrorMessage message={error} onRetry={refetch} />
            )}
            
            {!loading && !error && data.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-600">
                  No options data found for the selected criteria.
                </p>
              </div>
            )}
            
            {!loading && !error && data.length > 0 && (
              <OptionsScatterPlot 
                data={data} 
                width={dimensions.width} 
                height={dimensions.height} 
              />
            )}
          </div>
        </div>

        {/* Enhancement Comments Section */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Future Enhancement Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
            <div>
              <h4 className="font-medium mb-2">Gamma Exposure Overlay</h4>
              <p>Add gamma exposure calculations and visualization as heatmap overlay to identify key support/resistance levels and dealer positioning.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Implied Volatility Surface</h4>
              <p>Implement 3D volatility surface visualization showing IV across strikes and expirations to identify volatility skew and term structure.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Greeks Dashboard</h4>
              <p>Add comprehensive Greeks analysis (Delta, Gamma, Theta, Vega) with portfolio-level aggregation and risk metrics.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Real-time Updates</h4>
              <p>Implement WebSocket connections for real-time options data updates and live P&L tracking for active positions.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Powered by Polygon.io API • Built with React, D3.js & Vite
            </p>
            <p className="text-sm text-gray-500">
              Data provided by Polygon.io
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;