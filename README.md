# AAPL Options Data Visualization

A beautiful, production-ready web application for visualizing Apple (AAPL) options chain data using interactive D3.js scatter plots. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Interactive Scatter Plot**: Visualize options data with strike price vs expiration date
- **Data-Driven Sizing**: Circle sizes represent open interest levels
- **Color Coding**: Blue circles for call options, red circles for put options
- **Real-time Data**: Fetches live options data from Polygon.io API
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional UI**: Clean, modern interface with comprehensive data statistics
- **Error Handling**: Robust error handling with retry functionality
- **Performance Optimized**: Efficient data processing and rendering

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Visualization**: D3.js v7
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **API**: Polygon.io REST API

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd options-data-visualization
npm install
```

### 2. Get Polygon.io API Key

1. Visit [Polygon.io](https://polygon.io/dashboard)
2. Sign up for a free account
3. Navigate to your dashboard to get your API key
4. Copy the API key for the next step

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace `your_polygon_api_key_here` with your actual Polygon.io API key:
   ```env
   VITE_POLYGON_API_KEY=your_actual_api_key_here
   ```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set the build command: `npm run build`
3. Set the publish directory: `dist`
4. Add environment variable: `VITE_POLYGON_API_KEY` with your API key
5. Deploy!

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Ensure environment variables are configured on your hosting platform

## API Usage

The application uses the Polygon.io REST API to fetch options chain data:

- **Endpoint**: `/v3/reference/options/contracts`
- **Parameters**: 
  - `underlying_ticker`: AAPL (Apple stock)
  - `limit`: 1000 contracts
  - Filters applied for active contracts with open interest

## Data Visualization

### Scatter Plot Dimensions
- **X-Axis**: Strike Price (in USD)
- **Y-Axis**: Expiration Date
- **Circle Size**: Open Interest (larger circles = higher open interest)
- **Color**: Contract Type (Blue = Calls, Red = Puts)

### Interactive Features
- **Hover Tooltips**: Display detailed contract information
- **Responsive Sizing**: Automatically adjusts to screen size
- **Smooth Animations**: Professional entrance animations
- **Grid Lines**: Background grid for easier data reading

## Future Enhancements

The codebase includes comments and structure for future enhancements:

### 1. Gamma Exposure Overlay
```typescript
// TODO: Implement gamma exposure calculations
// This would show dealer positioning and key support/resistance levels
```

### 2. Implied Volatility Surface
```typescript
// TODO: Add 3D volatility surface visualization
// Show IV across strikes and expirations
```

### 3. Greeks Dashboard
```typescript
// TODO: Comprehensive Greeks analysis
// Delta, Gamma, Theta, Vega with portfolio aggregation
```

### 4. Real-time Updates
```typescript
// TODO: WebSocket implementation for live data
// Real-time options data updates and P&L tracking
```

## Code Structure

```
src/
├── components/           # React components
│   ├── OptionsScatterPlot.tsx    # Main D3.js visualization
│   ├── LoadingSpinner.tsx        # Loading state component
│   └── ErrorMessage.tsx          # Error handling component
├── hooks/               # Custom React hooks
│   └── useOptionsData.ts         # Data fetching hook
├── services/            # API services
│   └── polygonApi.ts             # Polygon.io API client
├── types/               # TypeScript type definitions
│   └── options.ts                # Options data types
└── App.tsx              # Main application component
```

## Performance Considerations

- **Data Limiting**: Limits to 500 contracts for optimal performance
- **Efficient Filtering**: Filters out expired and zero open interest contracts
- **Optimized Rendering**: Uses D3.js for efficient SVG rendering
- **Responsive Design**: Adapts chart size based on container

## Security

- **Environment Variables**: API keys stored securely in environment variables
- **Client-side API Calls**: Direct API calls (consider API proxy for production)
- **Error Handling**: Comprehensive error handling without exposing sensitive data

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the error messages in the browser console
2. Verify your Polygon.io API key is correctly set
3. Ensure you have an active Polygon.io subscription for options data
4. Review the Network tab in developer tools for API response details

---

Built with ❤️ using React, D3.js, and the Polygon.io API